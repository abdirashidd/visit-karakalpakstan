"use client";

import { useEffect, useMemo, useState } from "react";
import { generateTripPlan } from "../../lib/planner";
import { TripFormData } from "../../types";
import { places } from "../../data/places";
import { restaurants } from "../../data/restaurants"; 
import { hotels } from "../../data/hotels"; 

type MapPoint = {
  name: string;
  lat: number;
  lng: number;
  description: string;
};

// Xaritada bekatlarni raqam va chiziqlar bilan chiroyli ko'rsatuvchi funksiya
function InlineMap({ points }: { points: MapPoint[] }) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background: #1e293b; }
        #map { width: 100vw; height: 100vh; }
        .custom-marker {
          background-color: #38bdf8;
          color: #0f172a;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          font-family: sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map');
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var points = ${JSON.stringify(points.map((p, i) => ({...p, num: i + 1})))};
        var latlngs = [];
        
        points.forEach(function(p) {
          latlngs.push([p.lat, p.lng]);
          
          var icon = L.divIcon({
            className: 'custom-icon',
            html: '<div class="custom-marker">' + p.num + '</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          
          L.marker([p.lat, p.lng], {icon: icon})
            .bindPopup('<b style="font-family:sans-serif;font-size:14px;color:#2563eb;">' + p.num + '-bekat:</b><br/>' + p.name)
            .addTo(map);
        });

        if (latlngs.length > 1) {
          var polyline = L.polyline(latlngs, {
            color: '#38bdf8', 
            weight: 4, 
            opacity: 0.9, 
            dashArray: '10, 10'
          }).addTo(map);
          map.fitBounds(polyline.getBounds(), {padding: [50, 50]});
        } else if (latlngs.length === 1) {
          map.setView(latlngs[0], 14);
        } else {
          map.setView([42.465, 59.61], 10);
        }
      </script>
    </body>
    </html>
  `;

  const googleMapsRouteUrl = useMemo(() => {
    if (points.length === 0) return "#";
    
    if (points.length === 1) {
      return "https://www.google.com/maps/search/?api=1&query=" + points[0].lat + "," + points[0].lng;
    }

    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, -1).map(p => p.lat + "," + p.lng).join('|');

    let url = "https://www.google.com/maps/dir/?api=1&origin=" + origin.lat + "," + origin.lng + "&destination=" + destination.lat + "," + destination.lng + "&travelmode=driving";
    if (waypoints) {
      url = url + "&waypoints=" + waypoints;
    }
    
    return url;
  }, [points]);

  return (
    <div>
      <iframe
        title="Trip map"
        srcDoc={mapHtml}
        style={{
          width: "100%",
          height: "600px",
          border: "none",
          borderRadius: "20px",
          backgroundColor: "#1e293b",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)"
        }}
      />

      <div
        style={{
          marginTop: "16px",
          padding: "20px",
          borderRadius: "20px",
          background: "rgba(30, 41, 59, 0.5)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "16px", color: "white" }}>
          📍 Marshrut nuqtalari (Bosish mumkin)
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {points.map((point, index) => (
            <a
              href={"https://www.google.com/maps/search/?api=1&query=" + point.lat + "," + point.lng}
              target="_blank"
              rel="noopener noreferrer"
              key={`${point.name}-${index}`}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                textDecoration: "none",
                color: "inherit",
                padding: "8px",
                borderRadius: "12px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div
                style={{
                  minWidth: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "rgba(56, 189, 248, 0.2)",
                  color: "#38bdf8",
                  border: "1px solid #38bdf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                {index + 1}
              </div>

              <div>
                <div style={{ fontWeight: 700, color: "white" }}>{point.name}</div>
                <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px", lineHeight: "1.4" }}>
                  {point.description}
                </div>
              </div>
            </a>
          ))}

          {points.length > 1 && (
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16px",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              🗺️ Kunlik marshrutni Google xaritada ochish
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  
  const [tripPlan, setTripPlan] = useState<any>(null);

  // 🔥 SKANER VA SHARE UCHUN HOLATLAR
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedPlace, setScannedPlace] = useState<any>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hamrohTripData");

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TripFormData;
        setFormData(parsed);
      } catch (error) {
        console.error("Trip data parse xatosi:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (formData && !tripPlan) {
      setTripPlan(generateTripPlan(formData));
    }
  }, [formData, tripPlan]);

  const handleReplacePlace = (dayIndex: number, itemIndex: number) => {
    if (!tripPlan) return;

    const updatedPlan = { ...tripPlan, days: [...tripPlan.days] };
    const updatedItems = [...updatedPlan.days[dayIndex].items];
    const currentItem = updatedItems[itemIndex].item;

    if (!currentItem) return;

    const isRestaurant = currentItem.type === "restaurant" || currentItem.cuisine;
    
    const currentIds = new Set();
    tripPlan.days.forEach((day: any) => {
      day.items.forEach((planItem: any) => {
        if (planItem.item && planItem.item.id) {
          currentIds.add(planItem.item.id);
        }
      });
    });

    const dataSource = isRestaurant ? restaurants : places;
    const availableItems = dataSource.filter((p: any) => !currentIds.has(p.id));

    if (availableItems.length === 0) {
      alert("Zaxirada boshqa yangi variant qolmadi!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const replacementPlace = availableItems[randomIndex];
    
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      item: replacementPlace
    };

    updatedPlan.days[dayIndex].items = updatedItems;
    setTripPlan(updatedPlan);
  };

  const handleReplaceHotel = (dayIndex: number) => {
    if (!tripPlan) return;

    const updatedPlan = { ...tripPlan, days: [...tripPlan.days] };
    const currentHotel = updatedPlan.days[dayIndex].hotel;

    if (!currentHotel) return;

    const currentHotelIds = new Set();
    tripPlan.days.forEach((day: any) => {
      if (day.hotel) currentHotelIds.add(day.hotel.id);
    });

    const availableHotels = hotels.filter((h: any) => !currentHotelIds.has(h.id));

    if (availableHotels.length === 0) {
      alert("Zaxirada boshqa mehmonxona qolmadi!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableHotels.length);
    updatedPlan.days[dayIndex].hotel = availableHotels[randomIndex];

    setTripPlan(updatedPlan);
  };

  const startScan = () => {
    setScanning(true);
    setScannedPlace(null);
    setTimeout(() => {
      const demoPlace = places.find(p => p.name.toLowerCase().includes("kemalar")) || places[0];
      setScannedPlace(demoPlace);
      setScanning(false);
    }, 2500);
  };

  const handleAudioPlay = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) alert("Demo: AI tomonidan yaratilgan professional audio-gid (tarix va afsonalar) ishga tushdi!");
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      alert("🌟 Marshrutingiz chiroyli Instagram-story formatiga o'tkazildi va galereyangizga yuklandi!");
      setIsSharing(false);
    }, 2500);
  };

  if (!formData || !tripPlan) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", background: "#0f172a", color: "white" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid rgba(56, 189, 248, 0.3)", borderTopColor: "#38bdf8", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: "18px", fontWeight: 600 }}>AI reja yuklanmoqda...</p>
        </div>
      </main>
    );
  }

  const selectedDay = tripPlan.days[activeDay];

  const mapPoints = selectedDay.items
    .filter((planItem: any) => "lat" in (planItem.item || {}) && "lng" in (planItem.item || {}))
    .map((planItem: any) => ({
      name: planItem.item.name,
      lat: planItem.item.lat,
      lng: planItem.item.lng,
      description: planItem.item.description,
    }));

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        backgroundImage: "radial-gradient(circle at top right, #1e293b, #0f172a)",
        fontFamily: "sans-serif",
        padding: "20px 15px", 
        position: "relative",
        overflow: "hidden",
        color: "white"
      }}
    >
      {/* Orqa fondagi blur nurlar */}
      <div style={{ position: "absolute", top: "5%", left: "5%", width: "400px", height: "400px", background: "rgba(56, 189, 248, 0.1)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0 }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "300px", height: "300px", background: "rgba(192, 132, 252, 0.1)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 }}></div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* 🔥 YUQORIGA KO'TARILGAN QISM (Sarlavha, Tablar va QR Kod yonma-yon) */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "30px", marginBottom: "30px", marginTop: "20px" }}>
          
          {/* Chap qism: Sarlavha va Tablar */}
          <div style={{ flex: "1 1 500px" }}>
            <a href="/wizard" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", transition: "color 0.2s", marginBottom: "16px" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}>
              <span>←</span> So'rovnomaga qaytish
            </a>
            <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "10px", letterSpacing: "-1px", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
              Sizning <span style={{ color: "#38bdf8" }}>sayohatingiz</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "20px" }}>
              {formData.days} kunlik sayohat rejangiz AI tomonidan optimallashtirildi ✨
            </p>

            {/* Tablar (Kunlar) */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {tripPlan.days.map((day: any, index: number) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(index)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "16px",
                    border: activeDay === index ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                    background: activeDay === index ? "rgba(56, 189, 248, 0.15)" : "rgba(30, 41, 59, 0.4)",
                    color: activeDay === index ? "white" : "#94a3b8",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                    boxShadow: activeDay === index ? "0 0 20px rgba(56, 189, 248, 0.2)" : "none"
                  }}
                >
                  {day.day}-kun
                </button>
              ))}
            </div>
          </div>

          {/* O'ng qism: HAMROH PASS WIDGET (QR va Share shu yerga ko'tarildi) */}
          <div style={{
            flex: "1 1 350px", maxWidth: "450px",
            background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            flexWrap: "wrap",
            gap: "20px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "150%", height: "200%", background: "linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent)", transform: "rotate(30deg)", pointerEvents: "none" }}></div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 10, flexWrap: "wrap" }}>
              <div style={{ background: "white", padding: "8px", borderRadius: "16px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=HAMROH-PASS-${Math.floor(Math.random() * 10000)}`} 
                  alt="Hamroh Pass QR" 
                  style={{ width: "70px", height: "70px", borderRadius: "8px" }}
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 6px 0", fontSize: "18px", fontWeight: 800 }}>
                  <span style={{ background: "#ef4444", borderRadius: "6px", padding: "2px 6px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>PRO</span>
                  Hamroh Pass
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.9)", lineHeight: "1.5", maxWidth: "200px" }}>
                  Restoranlarda QR ni ko'rsating va <b style={{color: "#fde047", fontSize: "14px"}}>5% chegirma</b> oling!
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleShare}
              disabled={isSharing}
              style={{
                padding: "12px 20px",
                background: isSharing ? "#475569" : "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "13px",
                cursor: isSharing ? "wait" : "pointer",
                boxShadow: isSharing ? "none" : "0 10px 25px rgba(220, 39, 67, 0.4)",
                transition: "transform 0.2s",
                position: "relative",
                zIndex: 10,
                width: "100%"
              }}
            >
              {isSharing ? "🎨 Rasm chizilmoqda..." : "📸 Storisga ulashish"}
            </button>
          </div>
        </div>

        {/* ASOSIY GRID: MARSHRUT VA XARITA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* CHAP USTUN: KUNLIK REJA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={glassCardStyle}>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>{selectedDay.day}-kun</h2>
                <div style={{ color: "#38bdf8", fontWeight: 600, fontSize: "14px", background: "rgba(56,189,248,0.1)", padding: "6px 12px", borderRadius: "8px" }}>
                  📍 {selectedDay.region}
                </div>
              </div>

              {/* MEHMONXONA KARTOCHKASI */}
              {selectedDay.hotel && (
                <div style={{
                  background: "rgba(56, 189, 248, 0.05)", 
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  borderRadius: "20px",
                  padding: "16px",
                  marginBottom: "32px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  flexWrap: "wrap", 
                  backdropFilter: "blur(10px)"
                }}>
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "14px", 
                    background: "linear-gradient(135deg, #2563eb, #38bdf8)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "24px",
                    flexShrink: 0,
                    boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)"
                  }}>
                    🏨
                  </div>

                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        Turar joyingiz
                      </span>
                    </div>
                    <h5 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 800, color: "white" }}>
                      {selectedDay.hotel.name}
                    </h5>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ background: "rgba(250, 204, 21, 0.15)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: "#facc15" }}>
                        ⭐ {selectedDay.hotel.rating}
                      </span>
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(selectedDay.hotel.name + " " + selectedDay.hotel.city + " bog'lanish telefon band qilish")}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ background: "#2563eb", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: "white", textDecoration: "none" }}
                      >
                        📞 Band qilish
                      </a>
                      <button
                        onClick={() => handleReplaceHotel(activeDay)}
                        style={{
                          padding: "3px 10px", fontSize: "12px", color: "#f87171", backgroundColor: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "6px", cursor: "pointer", fontWeight: 600
                        }}
                      >
                        🔄 Almashtirish
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAYMLAYN QISMI */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {selectedDay.items.map((planItem: any, index: number) => (
                  <div
                    key={`${selectedDay.day}-${index}-${planItem.item?.id || index}`}
                    style={{
                      borderLeft: "3px solid rgba(56, 189, 248, 0.5)",
                      paddingLeft: "20px",
                      position: "relative"
                    }}
                  >
                    {/* Nuqta */}
                    <div style={{ position: "absolute", left: "-9px", top: "5px", width: "14px", height: "14px", borderRadius: "50%", background: "#0f172a", border: "3px solid #38bdf8", boxShadow: "0 0 10px #38bdf8" }}></div>

                    <div style={{ color: "#38bdf8", fontWeight: 800, fontSize: "15px", marginBottom: "8px" }}>
                      {planItem.time}
                    </div>

                    <div style={{ fontSize: "20px", fontWeight: 800, color: "white", marginBottom: "8px" }}>
                      {planItem.item?.name || planItem.title}
                    </div>

                    <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "12px" }}>
                      {planItem.item?.description || planItem.description}
                    </div>

                    {planItem.note && (
                      <div style={{ background: "rgba(56, 189, 248, 0.1)", borderLeft: "3px solid #38bdf8", borderRadius: "0 8px 8px 0", padding: "10px 14px", fontSize: "13px", color: "#e0f2fe", marginBottom: "16px", lineHeight: "1.5" }}>
                        <span style={{marginRight: "6px"}}>💡</span>{planItem.note}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      {planItem.item && "lat" in planItem.item && "lng" in planItem.item && (
                        <a
                          href={"https://www.google.com/maps/search/?api=1&query=" + planItem.item.lat + "," + planItem.item.lng}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "12px", padding: "8px 14px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", color: "#34d399", fontWeight: 700, textDecoration: "none", transition: "0.2s" }}
                        >
                          📍 Yo'nalish
                        </a>
                      )}

                      {planItem.item && planItem.item.type === "restaurant" && planItem.item.id !== 9999 && (
                         <a
                           href={`https://www.google.com/search?q=${encodeURIComponent((planItem.item.name || "") + " restoran " + (planItem.item.city || "") + " telefon")}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           style={{ fontSize: "12px", padding: "8px 14px", backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "10px", color: "#60a5fa", fontWeight: 700, textDecoration: "none", transition: "0.2s" }}
                         >
                           📞 Stol band qilish
                         </a>
                      )}

                      {planItem.item && planItem.item.id !== 9999 && (
                        <button
                          onClick={() => handleReplacePlace(activeDay, index)}
                          style={{ padding: "8px 14px", fontSize: "12px", color: "#f87171", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", cursor: "pointer", fontWeight: 700, transition: "0.2s" }}
                        >
                          🔄 Almashtirish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* O'NG USTUN: FAQAT XARITA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ ...glassCardStyle, padding: "24px" }}>
              <h2 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: 800 }}>
                Xarita va marshrut
              </h2>
              <InlineMap points={mapPoints} />
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 SUZUVCHI SKANER TUGMASI */}
      <button 
        onClick={() => setShowScanner(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          border: "none",
          boxShadow: "0 15px 35px rgba(16, 185, 129, 0.5)",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        📸
      </button>

      {/* 🔥 SKANER MODAL OYNASI */}
      {showScanner && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(15px)",
          zIndex: 50,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "20px", color: "white",
          animation: "fadeIn 0.3s ease"
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <button onClick={() => {setShowScanner(false); setScannedPlace(null); setScanning(false);}} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: "20px", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}>✕</button>

          {!scannedPlace ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", width: "100%" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 900, margin: 0, background: "linear-gradient(to right, #38bdf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>
                Tarixni skanerlang
              </h2>
              <div style={{ position: "relative", width: "260px", height: "260px", background: scanning ? "rgba(30,41,59,0.8)" : "rgba(30,41,59,0.4)", border: scanning ? "none" : "2px dashed #475569", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "0.3s" }}>
                {!scanning ? (
                  <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "16px", fontWeight: 600 }}>Kamera tayyor</div>
                ) : (
                  <>
                    <div style={{ position: "absolute", top: "20px", left: "20px", width: "40px", height: "40px", borderTop: "4px solid #38bdf8", borderLeft: "4px solid #38bdf8", borderRadius: "12px 0 0 0" }}></div>
                    <div style={{ position: "absolute", top: "20px", right: "20px", width: "40px", height: "40px", borderTop: "4px solid #38bdf8", borderRight: "4px solid #38bdf8", borderRadius: "0 12px 0 0" }}></div>
                    <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "40px", height: "40px", borderBottom: "4px solid #38bdf8", borderLeft: "4px solid #38bdf8", borderRadius: "0 0 0 12px" }}></div>
                    <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "40px", height: "40px", borderBottom: "4px solid #38bdf8", borderRight: "4px solid #38bdf8", borderRadius: "0 0 12px 0" }}></div>
                    <style>{`@keyframes scan { 0% { top: 10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 90%; opacity: 0; } }`}</style>
                    <div style={{ position: "absolute", width: "85%", height: "3px", background: "#38bdf8", boxShadow: "0 0 20px 8px rgba(56, 189, 248, 0.6)", animation: "scan 2s infinite cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
                  </>
                )}
              </div>
              <button onClick={startScan} disabled={scanning} style={{ padding: "16px 32px", background: scanning ? "#334155" : "linear-gradient(135deg, #2563eb, #4f46e5)", color: "white", border: "none", borderRadius: "16px", fontSize: "16px", fontWeight: 800, cursor: scanning ? "not-allowed" : "pointer", boxShadow: scanning ? "none" : "0 15px 35px rgba(37, 99, 235, 0.4)", transition: "0.3s" }}>
                {scanning ? "Qidirilmoqda..." : "Kamerani ishga tushirish"}
              </button>
            </div>
          ) : (
            <div style={{ width: "100%", maxWidth: "400px", background: "#1e293b", borderRadius: "24px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ height: "200px", position: "relative" }}>
                <img src={scannedPlace.image} alt={scannedPlace.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(15,23,42,1))", padding: "20px 20px 16px" }}>
                  <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "white" }}>{scannedPlace.name}</h2>
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ background: "#0f172a", borderRadius: "16px", padding: "16px", marginBottom: "20px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}><span>🎧</span> AI Audio-Gid</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={handleAudioPlay} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{audioPlaying ? "⏸" : "▶"}</button>
                    <div style={{ flex: 1, height: "6px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: audioPlaying ? "40%" : "0%", height: "100%", background: "#38bdf8", transition: "width 1s linear" }}></div>
                    </div>
                  </div>
                </div>
                <p style={{ margin: "0 0 20px 0", color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", borderLeft: "3px solid #38bdf8", paddingLeft: "12px", background: "rgba(56,189,248,0.05)", padding: "12px", borderRadius: "0 12px 12px 0" }}>"{scannedPlace.aiTip}"</p>
                <button onClick={() => {setShowScanner(false); alert("Sayyoh endi aynan shu yerdan boshlanadigan yangi rejaga yo'naltiriladi!");}} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
                  📍 Shu yerdan marshrut tuzish
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

const glassCardStyle: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.6)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
};