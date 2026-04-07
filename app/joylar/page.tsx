"use client";

import { places } from "../../data/places";

export default function JoylarPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "sans-serif",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>Joylar</h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "28px" }}>
          Qoraqalpog‘istondagi mashhur joylar ro‘yxati
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {places.map((place) => (
            <div
              key={place.id}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  height: "180px",
                  borderRadius: "14px",
                  background: "#e8eefc",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Rasm joyi
              </div>

              <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
                {place.name}
              </h2>

              <p style={{ color: "#555", marginBottom: "12px", lineHeight: 1.6 }}>
                {place.description}
              </p>

              <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>
                Hudud: {place.region}
              </div>

              <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                Eng yaxshi vaqt: {place.bestTime}
              </div>

              <div style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                Tashrif davomiyligi: {place.visitHours} soat
              </div>

              <div
                style={{
                  background: "#eef4ff",
                  color: "#2563eb",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  fontSize: "14px",
                }}
              >
                {place.aiTip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}