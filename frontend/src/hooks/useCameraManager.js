// src/hooks/useCameraManager.js
import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../utils/helpers";

export function useCameraManager() {
  const [cameras, setCameras] = useState([]);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchCameras = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cameras`);
      const data = await response.json();
      setCameras(data);

      // BACA LINK OTOMATIS DARI KAMERA YANG AKTIF DI DATABASE
      const active = data.find((c) => c.isActive);
      if (active) {
        setPreviewUrl(`${active.url}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Gagal load kamera:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newUrl) return alert("Nama dan URL harus diisi!");

    try {
      await fetch(`${API_BASE_URL}/api/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, url: newUrl }),
      });
      setNewName("");
      setNewUrl("");
      fetchCameras();
    } catch (err) {
      console.error("Gagal menambah kamera:", err);
      alert("Terjadi kesalahan saat menyimpan kamera.");
    }
  };

  const handleSwitch = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/cameras/switch/${id}`, {
        method: "POST",
      });
      // Cukup panggil fetchCameras, karena logic ubah URL preview udah ada di dalamnya
      fetchCameras();
    } catch (err) {
      console.error("Gagal mengganti kamera:", err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Peringatan: Menghapus kamera ini mungkin akan memutus tautan dengan data riwayat. Lanjutkan?",
      )
    ) {
      try {
        await fetch(`${API_BASE_URL}/api/cameras/${id}`, { method: "DELETE" });
        fetchCameras();
      } catch (err) {
        console.error("Gagal menghapus kamera:", err);
      }
    }
  };

  const activeCam = useMemo(() => cameras.find((c) => c.isActive), [cameras]);

  return {
    cameras,
    newName,
    setNewName,
    newUrl,
    setNewUrl,
    previewUrl,
    activeCam,
    handleAdd,
    handleSwitch,
    handleDelete,
  };
}
