import cv2
from ultralytics import YOLO
import time
import requests
from flask import Flask, Response
import base64

# =========================
# INIT
# =========================
app = Flask(__name__)
model = YOLO('model/best.pt') 

# 🔥 ENDPOINT NODE.JS (UDAH PINDAH KE AZURE CLOUD ☁️)
AZURE_URL = 'https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net'

BACKEND_URL = f'{AZURE_URL}/api/alerts'
CAMERA_API_URL = f'{AZURE_URL}/api/cameras/active' 
CONFIG_API_URL = f'{AZURE_URL}/api/config' 

print("CLASSES DARI MODEL:", model.names)

# =========================
# KAMUS AI
# =========================
SAFE_MAP = {'helmet': 'HELMET', 'gloves': 'GLOVES', 'boots': 'BOOTS', 'vest': 'VEST', 'goggles': 'GOGGLES'}
VIOLATION_MAP = {'no-helmet': 'NO HELMET', 'no-gloves': 'NO GLOVES', 'no-boots': 'NO BOOTS', 'no-vest': 'NO VEST', 'no-goggles': 'NO GOGGLES'}
PAIR_MAP = {'no-helmet': 'helmet', 'no-gloves': 'gloves', 'no-boots': 'boots', 'no-vest': 'vest', 'no-goggles': 'goggles'}

# =========================
# FUNGSI CEK SISTEM (KAMERA + SAKLAR AI)
# =========================
def get_system_config():
    # 1. PAKSA PAKAI FILE LOKAL (BIAR GAK LOOPING KE CLOUDFLARE)
    cam_url = 'simulasi9.mp4' 
    ai_active = True 
    
    # KITA KOMENTARI / MATIKAN DULU PENGAMBILAN URL DARI AZURE
    """
    try:
        res_cam = requests.get(CAMERA_API_URL, timeout=2)
        if res_cam.status_code == 200:
            cam_url = res_cam.json()['url'] 
    except:
        pass
    """
        
    # 2. Cek Saklar AI (ON / OFF) - INI BIARKAN NYALA BIAR TOMBOL WEB JALAN
    try:
        res_conf = requests.get(CONFIG_API_URL, timeout=1)
        if res_conf.status_code == 200:
            ai_active = res_conf.json()['ai_active']
    except:
        pass
        
    return cam_url, ai_active

# =========================
# STREAM GENERATOR
# =========================
def generate_frames():
    current_url, ai_active = get_system_config()
    print(f"🎬 Stream: {current_url} | AI: {'ON' if ai_active else 'OFF'}")
    cap = cv2.VideoCapture(current_url)
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    delay = 1.0 / fps if fps > 0 else 0.03
    
    # 🔥 OPTIMASI 1: COOLDOWN DIPERCEPAT JADI 5 DETIK BIAR DEMO LANCAR
    cooldown_time = 5 
    last_alert_time = {
        'NO HELMET': 0, 'NO GLOVES': 0, 'NO BOOTS': 0, 
        'NO VEST': 0, 'NO GOGGLES': 0
    }
    last_safe_ping_time = 0
    frame_counter = 0 

    while True:
        frame_counter += 1
        
        # Cek Database tiap 30 frame (~1 detik)
        if frame_counter % 30 == 0:
            new_url, new_ai_active = get_system_config()
            ai_active = new_ai_active 
            
            if new_url != current_url:
                print(f"🔄 Ganti Kamera: {new_url}")
                cap.release() 
                current_url = new_url
                cap = cv2.VideoCapture(current_url) 
                continue

        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        # ==========================================
        # LOGIKA SAKLAR AI 
        # ==========================================
        if ai_active:
            results = model(frame, conf=0.1, iou=0.5, verbose=False)

            if len(results) > 0:
                safe_boxes = []
                violation_boxes = []
                has_real_violation = False 

                for box in results[0].boxes:
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id].lower()
                    confidence = float(box.conf[0]) * 100
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    if class_name in SAFE_MAP:
                        safe_boxes.append((x1, y1, x2, y2, class_name, confidence))
                    elif class_name in VIOLATION_MAP:
                        violation_boxes.append((x1, y1, x2, y2, class_name, confidence))

                for (sx1, sy1, sx2, sy2, s_name, s_conf) in safe_boxes:
                    cv2.rectangle(frame, (sx1, sy1), (sx2, sy2), (0, 255, 0), 2)
                    cv2.putText(frame, f"SAFE: {SAFE_MAP[s_name]} ({s_conf:.0f}%)", (sx1, sy1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                for (vx1, vy1, vx2, vy2, v_name, v_conf) in violation_boxes:
                    is_false_alarm = False
                    center_x, center_y = (vx1 + vx2) // 2, (vy1 + vy2) // 2
                    safe_partner = PAIR_MAP.get(v_name)

                    for (sx1, sy1, sx2, sy2, s_name, _) in safe_boxes:
                        if s_name == safe_partner and (sx1 - 30 <= center_x <= sx2 + 30 and sy1 - 30 <= center_y <= sy2 + 30):
                            is_false_alarm = True
                            break

                    if not is_false_alarm:
                        has_real_violation = True
                        cv2.rectangle(frame, (vx1, vy1), (vx2, vy2), (0, 0, 255), 2)
                        v_label = VIOLATION_MAP[v_name]
                        cv2.putText(frame, f"ALERT: {v_label} ({v_conf:.0f}%)", (vx1, vy1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

                        current_time = time.time()
                        if current_time - last_alert_time.get(v_label, 0) > cooldown_time:
                            try:
                                # 🔥 OPTIMASI 2: FOTO DIKECILIN BIAR UPLOAD NGEBUT!
                                snap_resized = cv2.resize(frame, (320, 180))
                                _, snap_buffer = cv2.imencode('.jpg', snap_resized, [int(cv2.IMWRITE_JPEG_QUALITY), 40])
                                img_base64 = base64.b64encode(snap_buffer).decode('utf-8')

                                # 🔥 OPTIMASI 3: TAMBAH TIMEOUT BIAR VIDEO GAK STUCK!
                                requests.post(BACKEND_URL, json={
                                    "timestamp": current_time, "type": "safety_violation",
                                    "detail": f"{v_label} Detected", "worker_status": "active",
                                    "image_b64": img_base64
                                }, timeout=1) 
                                last_alert_time[v_label] = current_time
                            except Exception as e:
                                pass

                current_time = time.time()
                if len(safe_boxes) > 0 and not has_real_violation:
                    if current_time - last_safe_ping_time > 5: 
                        try:
                            # 🔥 OPTIMASI 3: TAMBAH TIMEOUT DI SINI JUGA!
                            requests.post(BACKEND_URL, json={
                                "timestamp": current_time, "type": "safety_compliant",
                                "detail": "Worker Compliant", "worker_status": "active"
                            }, timeout=1)
                            last_safe_ping_time = current_time
                        except Exception as e:
                            pass 

        frame_resized = cv2.resize(frame, (480, 270))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 40]
        _, buffer = cv2.imencode('.jpg', frame_resized, encode_param)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        
        # Kasih jeda dikit biar CPU laptop gak meledak
        time.sleep(0.05) 

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("🚀 Mesin AI Menyala: http://localhost:5000/video_feed")
    app.run(host='0.0.0.0', port=5000, threaded=True)