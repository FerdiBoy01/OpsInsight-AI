# 👁️⚡ OpsInsight AI
**End-to-End Workforce Safety Monitoring & AI Decision Support System**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Microsoft Azure](https://img.shields.io/badge/Microsoft_Azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()

---

## 🚀 Tentang Produk

**OpsInsight AI** adalah platform monitoring keselamatan kerja berbasis AI yang mengubah CCTV biasa menjadi sistem pengawasan cerdas.

Sistem ini mampu:
- Mendeteksi penggunaan APD (helm, rompi, dll)
- Mencatat pelanggaran secara otomatis
- Memberikan analisis dan rekomendasi berbasis data

👉 Tujuan utama:
**mengurangi human error dan meningkatkan safety compliance secara real-time**

---

## 🎯 Problem & Solusi

### ❌ Problem
- Pengawasan manual tidak efektif
- Rentan human error
- Tidak ada data historis yang terstruktur
- Respons terhadap pelanggaran lambat

### ✅ Solusi (OpsInsight AI)
- Deteksi otomatis berbasis Computer Vision
- Monitoring real-time via dashboard
- Penyimpanan data pelanggaran terpusat
- Analisis tren & rekomendasi berbasis AI

---

## 🔍 Demo Scenario (How It Works)

1. Admin membuka dashboard OpsInsight AI  
2. Sistem menampilkan live monitoring area kerja  
3. AI mendeteksi pekerja tanpa APD  
4. Sistem otomatis:
   - Menandai pelanggaran (bounding box)
   - Menyimpan bukti visual
   - Mengirim alert ke dashboard  
5. Data masuk ke laporan harian  
6. Sistem menampilkan analisis & insight operasional  

---

## ✨ Fitur Utama

- 🧠 **AI Safety Detection**  
  Deteksi otomatis APD menggunakan YOLO (helmet, vest, dll)

- 📊 **Dashboard Monitoring**  
  Tampilan real-time aktivitas dan pelanggaran

- 🚨 **Real-Time Alert System**  
  Notifikasi langsung saat pelanggaran terjadi

- 📁 **Incident Logging**  
  Penyimpanan data pelanggaran lengkap dengan bukti

- 📈 **Analytics & Reporting**  
  Grafik tren pelanggaran dan safety score

- ⚙️ **AI Mode Toggle (ON/OFF)**  
  Fleksibilitas monitoring manual & otomatis

- 🧠 **Decision Support System (DSS)**  
  Insight berbasis data untuk membantu pengambilan keputusan

---

## 🏗️ Arsitektur Sistem

Sistem menggunakan pendekatan **Decoupled Architecture**:


[ AI Engine (Local / VM) ]
↓
[ Backend API (Azure) ]
↓
[ Database (MongoDB Atlas) ]
↓
[ Frontend Dashboard (Vercel) ]



### Penjelasan:
- **AI Engine**: deteksi objek dari video
- **Backend**: menerima & mengelola data
- **Database**: menyimpan histori pelanggaran
- **Frontend**: menampilkan dashboard monitoring

---

## 💻 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Recharts
- Lucide Icons

### Backend
- Node.js
- Express.js
- REST API

### AI & Computer Vision
- Python
- OpenCV
- YOLOv8 (Ultralytics)

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Microsoft Azure
- AI Engine: Local / VM

---

## 📈 Impact & Value

OpsInsight AI memberikan nilai nyata untuk industri:

- ✅ Mengurangi human error dalam pengawasan
- ✅ Meningkatkan kepatuhan pekerja
- ✅ Monitoring real-time tanpa tenaga tambahan
- ✅ Data-driven decision making
- ✅ Efisiensi operasional & keamanan kerja

---

## ⚠️ Demo Mode (Important Note)

Untuk keperluan demo:

- Video menggunakan sample footage  
- AI berjalan dalam mode simulasi real-time  
- Sistem tetap mencerminkan arsitektur production-ready  

---

## 📸 Screenshots

> Tambahkan screenshot dashboard kamu di sini

---

## 🧪 Cara Menjalankan Project

### 1. Jalankan Backend
```bash
cd backend
npm install
npm run dev
