"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 🔥 XATONI TO'G'RILASH: Turlarni shu faylning o'zida e'lon qilamiz
type TravelType = "tarixiy" | "muzey" | "tabiat" | "instagram" | "mahalliy" | "taomlar";
type PeopleRange = "1" | "2-3" | "4+";
type BudgetLevel = "past" | "ortacha" | "yuqori";

// Emojilar bilan boyitilgan variantlar
const travelOptions: { label: string; value: TravelType; icon: string }[] = [
  { label: "Tarixiy joylar", value: "tarixiy", icon: "🏛" },
  { label: "Muzeylar", value: "muzey", icon: "🖼" },
  { label: "Tabiat", value: "tabiat", icon: "🌿" },
  { label: "Instagram joylar", value: "instagram", icon: "📸" },
  { label: "Mahalliy hayot", value: "mahalliy", icon: "🏘" },
  { label: "Taomlar", value: "taomlar", icon: "🥘" },
];

const peopleOptions: PeopleRange[] = ["1", "2-3", "4+"];

const budgetOptions: { label: string; value: BudgetLevel; desc: string }[] = [
  { label: "Past", value: "past", desc: "Tejamkor sayohat" },
  { label: "O‘rtacha", value: "ortacha", desc: "Qulay narx" },
  { label: "Yuqori", value: "yuqori", desc: "Premium tajriba" },
];

export default function WizardPage() {
  const router = useRouter();

  // Holatlar (States)
  const [step, setStep] = useState(1);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState<PeopleRange | null>(null);
  const [budget, setBudget] = useState<BudgetLevel | null>(null);

  // Keyingi qadamga o'tish shartlari
  const canGoStep2 = travelTypes.length > 0;
  const canGoStep3 = days >= 1;
  const canGoStep4 = !!people;
  const canSubmit = travelTypes.length > 0 && !!people && !!budget;

  function toggleTravelType(value: TravelType) {
    setTravelTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  function goNext() {
    if (step === 1 && !canGoStep2) return;
    if (step === 2 && !canGoStep3) return;
    if (step === 3 && !canGoStep4) return;
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function goBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function handleGeneratePlan() {
    if (!canSubmit || !people || !budget) return;

    const tripData = {
      travelTypes,
      days,
      people,
      budget,
    };

    localStorage.setItem("hamrohTripData", JSON.stringify(tripData));
    router.push("/plan");
  }

  return (
    <main style={{ 
      minHeight: "100vh", 
      backgroundColor: "#0f172a", 
      backgroundImage: "radial-gradient(circle at 50% -20%, #1e293b, #0f172a)", 
      fontFamily: "sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Orqa fondagi yorug'lik effektlari */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: "300px", height: "300px", background: "rgba(56, 189, 248, 0.15)", filter: "blur(100px)", borderRadius: "50%" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: "400px", height: "400px", background: "rgba(192, 132, 252, 0.1)", filter: "blur(120px)", borderRadius: "50%" }}></div>

      {/* Tepadagi "Orqaga" tugmasi */}
      <Link href="/" style={{ position: "absolute", top: "40px", left: "40px", color: "#94a3b8", textDecoration: "none", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", transition: "color 0.2s", zIndex: 20 }}
        onMouseOver={(e) => e.currentTarget.style.color = "white"}
        onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}
      >
        <span>←</span> Bosh sahifa
      </Link>

      {/* Asosiy Glassmorphism Oyna */}
      <div style={{ 
        width: "100%", maxWidth: "800px", 
        background: "rgba(30, 41, 59, 0.6)", 
        backdropFilter: "blur(20px)", 
        borderRadius: "24px", 
        padding: "48px 32px", 
        border: "1px solid rgba(255, 255, 255, 0.05)", 
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        textAlign: "center",
        position: "relative",
        zIndex: 10
      }}>
        
        <h1 style={{ fontSize: "42px", fontWeight: 800, color: "white", marginBottom: "10px", letterSpacing: "-1px" }}>
          Hamroh <span style={{ color: "#38bdf8" }}>AI</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "40px" }}>
          Qoraqalpog&apos;istonda sayohatingizni boshlaymiz
        </p>

        {/* Progress Bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "42px" }}>
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              style={{
                width: "60px",
                height: "6px",
                borderRadius: "999px",
                background: item <= step ? "#38bdf8" : "rgba(255,255,255,0.1)",
                boxShadow: item <= step ? "0 0 10px rgba(56,189,248,0.5)" : "none",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>

        {/* 1-QADAM: Sayohat turi */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "12px" }}>
              Qanday sayohat qilishni xohlaysiz?
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
              Bir yoki bir nechta yo‘nalishni tanlashingiz mumkin
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
              {travelOptions.map((option) => {
                const selected = travelTypes.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleTravelType(option.value)}
                    style={cardStyle(selected)}
                    onMouseOver={(e) => hoverCard(e, selected, true)}
                    onMouseOut={(e) => hoverCard(e, selected, false)}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{option.icon}</div>
                    <div style={{ color: selected ? "white" : "#cbd5e1", fontWeight: 600, fontSize: "16px" }}>{option.label}</div>
                  </button>
                );
              })}
            </div>

            <button onClick={goNext} disabled={!canGoStep2} style={primaryButtonStyle(!canGoStep2)}>
              Keyingisi ➔
            </button>
          </div>
        )}

        {/* 2-QADAM: Kunlar soni */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "30px" }}>
              Necha kun?
            </h2>

            <div style={{ maxWidth: "600px", margin: "0 auto 30px" }}>
              {/* HTML range input uchun oddiy stil, qoramtir fonga moslangan */}
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer", accentColor: "#38bdf8" }}
              />
            </div>

            <div style={{ fontSize: "72px", fontWeight: 800, color: "white", marginBottom: "40px", textShadow: "0 0 20px rgba(56,189,248,0.4)" }}>
              {days} <span style={{ fontSize: "24px", color: "#94a3b8", fontWeight: 600 }}>kun</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button onClick={goBack} style={secondaryButtonStyle}>← Orqaga</button>
              <button onClick={goNext} style={primaryButtonStyle(false)}>Keyingisi ➔</button>
            </div>
          </div>
        )}

        {/* 3-QADAM: Odamlar soni */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "30px" }}>
              Necha kishi?
            </h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
              {peopleOptions.map((item) => {
                const selected = people === item;
                return (
                  <button
                    key={item}
                    onClick={() => setPeople(item)}
                    style={{ ...cardStyle(selected), width: "150px", height: "150px" }}
                    onMouseOver={(e) => hoverCard(e, selected, true)}
                    onMouseOut={(e) => hoverCard(e, selected, false)}
                  >
                    <div style={{ fontSize: "36px", color: selected ? "white" : "#cbd5e1", fontWeight: 800 }}>
                      {item}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button onClick={goBack} style={secondaryButtonStyle}>← Orqaga</button>
              <button onClick={goNext} disabled={!canGoStep4} style={primaryButtonStyle(!canGoStep4)}>Keyingisi ➔</button>
            </div>
          </div>
        )}

        {/* 4-QADAM: Byudjet */}
        {step === 4 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "30px" }}>
              Byudjet darajasi
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
              {budgetOptions.map((option) => {
                const selected = budget === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setBudget(option.value)}
                    style={cardStyle(selected)}
                    onMouseOver={(e) => hoverCard(e, selected, true)}
                    onMouseOut={(e) => hoverCard(e, selected, false)}
                  >
                    <div style={{ fontSize: "24px", color: selected ? "white" : "#cbd5e1", fontWeight: 700, marginBottom: "8px" }}>
                      {option.label}
                    </div>
                    <div style={{ color: selected ? "#bae6fd" : "#64748b", fontSize: "14px" }}>
                      {option.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button onClick={goBack} style={secondaryButtonStyle}>← Orqaga</button>
              <button onClick={handleGeneratePlan} disabled={!canSubmit} style={primaryButtonStyle(!canSubmit)}>
                ✨ AI reja tuzish
              </button>
            </div>
          </div>
        )}
        
        {/* CSS Animation */}
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </main>
  );
}

// Yordamchi dizayn funksiyalari
function cardStyle(selected: boolean): React.CSSProperties {
  return {
    background: selected ? "rgba(56, 189, 248, 0.15)" : "rgba(15, 23, 42, 0.4)",
    border: selected ? "2px solid #38bdf8" : "2px solid rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "24px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: selected ? "0 10px 25px rgba(56, 189, 248, 0.2)" : "none",
    transform: selected ? "translateY(-3px)" : "none",
  };
}

function hoverCard(e: React.MouseEvent<HTMLButtonElement>, selected: boolean, isHover: boolean) {
  if (!selected) {
    e.currentTarget.style.background = isHover ? "rgba(255,255,255,0.05)" : "rgba(15, 23, 42, 0.4)";
  }
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "16px 36px",
    borderRadius: "12px",
    border: "none",
    background: disabled ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: disabled ? "#64748b" : "white",
    fontSize: "18px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 10px 25px rgba(37, 99, 235, 0.4)",
    transition: "all 0.3s ease",
  };
}

const secondaryButtonStyle: React.CSSProperties = {
  padding: "16px 36px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "white",
  fontSize: "18px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
};