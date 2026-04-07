"use client";

import { useState, useEffect } from "react";
import { places } from "../../data/places";
import { Place } from "../../types";

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedPlace, setScannedPlace] = useState<Place | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Haqiqiy qidiruvni imitatsiya qilish (2 soniyadan keyin Mo'ynoqni topadi)
  const startScan = () => {
    setScanning(true);
    setScannedPlace(null);
    
    setTimeout(() => {
      // Demo uchun "Kemalar qabristoni" (yoki bazangizdagi istalgan bitta zo'r joyni) topamiz
      // Agar bazangizda ID lar boshqacha bo'lsa, shunchaki places[0] ni olib qo'yamiz
      const demoPlace = places.find(p => p.name.toLowerCase().includes("kemalar")) || places[0];
      setScannedPlace(demoPlace);
      setScanning(false);
    }, 2500);
  };

  const handleAudioPlay = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) {
      alert("Demo: Bu yerda AI tomonidan yaratilgan professional audio-gid (tarix va afsonalar) qoraqalpoq, o'zbek yoki ingliz tilida yangraydi!");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Sarlavha */}
      <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 10px 0", background: "linear-gradient(to right, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tarixni skanerlash
        </h1>
        <p style={{ color: "#94a3b8", maxWidth: "400px", margin: "0 auto", lineHeight: "1.5" }}>
          Obyektlardagi Hamroh-QR kodni skanerlang va bu joyning yashirin sirlari hamda AI audio-gidini tinglang.
        </p>
      </div>

      {/* SKANER QISMI */}
      {!scannedPlace && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", width: "100%" }}>
          <div 
            style={{
              position: "relative",
              width: "280px",
              height: "280px",
              background: scanning ? "#1e293b" : "#0f172a",
              border: scanning ? "none" : "2px dashed #334155",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "0.3s"
            }}
          >
            {!scanning ? (
              <div style={{ textAlign: "center", color: "#64748b" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📷</div>
                <div>Kamera tayyor</div>
              </div>
            ) : (
              <>
                {/* Kamera burchaklari (Vizir) */}
                <div style={{ position: "absolute", top: "20px", left: "20px", width: "40px", height: "40px", borderTop: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "8px 0 0 0" }}></div>
                <div style={{ position: "absolute", top: "20px", right: "20px", width: "40px", height: "40px", borderTop: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 8px 0 0" }}></div>
                <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "40px", height: "40px", borderBottom: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "0 0 0 8px" }}></div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "40px", height: "40px", borderBottom: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 0 8px 0" }}></div>
                
                {/* Lazer animatsiyasi (Inline CSS bilan) */}
                <style>
                  {`
                    @keyframes scanLaser {
                      0% { top: 10%; opacity: 0; }
                      10% { opacity: 1; }
                      90% { opacity: 1; }
                      100% { top: 90%; opacity: 0; }
                    }
                  `}
                </style>
                <div style={{
                  position: "absolute",
                  width: "90%",
                  height: "2px",
                  background: "#3b82f6",
                  boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.5)",
                  animation: "scanLaser 2s infinite linear"
                }}></div>
                <div style={{ color: "#3b82f6", fontWeight: 700, zIndex: 10 }}>Skanerlanmoqda...</div>
              </>
            )}
          </div>

          <button
            onClick={startScan}
            disabled={scanning}
            style={{
              padding: "16px 32px",
              background: scanning ? "#334155" : "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "18px",
              fontWeight: 700,
              cursor: scanning ? "not-allowed" : "pointer",
              boxShadow: scanning ? "none" : "0 10px 25px rgba(37, 99, 235, 0.4)",
              transition: "0.2s"
            }}
          >
            {scanning ? "Obyekt qidirilmoqda..." : "QR Kodni Skanerlash"}
          </button>
        </div>
      )}

      {/* NATIJA QISMI (AQLLI GID) */}
      {scannedPlace && (
        <div style={{ width: "100%", maxWidth: "480px", animation: "fadeIn 0.5s" }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
              Muvaffaqiyatli topildi
            </div>
            <button onClick={() => setScannedPlace(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}>✕ Yopish</button>
          </div>

          <div style={{ background: "#1e293b", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ height: "220px", position: "relative" }}>
              <img src={scannedPlace.image} alt={scannedPlace.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "20px", color: "white" }}>
                <span style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, marginBottom: "8px", display: "inline-block" }}>
                  📍 {scannedPlace.region}
                </span>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>{scannedPlace.name}</h2>
              </div>
            </div>

            <div style={{ padding: "24px" }}>
              {/* AI Audio Gid Player */}
              <div style={{ background: "#0f172a", borderRadius: "16px", padding: "16px", marginBottom: "20px", border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>🎧</span> AI Audio-Gid
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>03:45</span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button 
                    onClick={handleAudioPlay}
                    style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#3b82f6", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    {audioPlaying ? "⏸" : "▶"}
                  </button>
                  <div style={{ flex: 1, height: "6px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: audioPlaying ? "35%" : "0%", height: "100%", background: "#3b82f6", transition: "width 1s linear" }}></div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "8px" }}>Yashirin ma'lumot:</h3>
              <p style={{ margin: "0 0 24px 0", lineHeight: "1.6", color: "#e2e8f0" }}>
                {scannedPlace.description} {scannedPlace.aiTip}
              </p>

              <button 
                onClick={() => alert("Sayyoh endi aynan shu nuqtadan boshlanadigan marshrut formulasiga yo'naltiriladi!")}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                🗺️ Shu yerdan marshrut tuzish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}