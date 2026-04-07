"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  // 🔥 12 TA ETIBORGA LOYIQ JOYLAR RO'YXATI
  const destinations = [
    {
      name: "Orol Dengizi Fojiasi",
      desc: "Mo'ynoqdagi kemalar qabristoni va cho'lga aylangan dengiz tubi sirlari.",
      image: "/orol.png", 
      aiTip: "Bilasizmi? 1960-yillarda Mo'ynoq portidan kuniga yuzlab kemalar jo'nab ketgan. Hozir u yerda qanday qilib yirik kemalar cho'l o'rtasida qolib ketganini va kema qabristonining asl sirini eshitishni xohlaysizmi?"
    },
    {
      name: "Savitskiy Muzeyi",
      desc: "Cho'ldagi Luvr. Dunyodagi ikkinchi eng yirik rus avangard san'ati to'plami.",
      image: "/sovetskiy.png", 
      aiTip: "Muzey yerto'lasida 50 yil davomida yashirib kelingan, sovet hukumati taqiqlagan noyob rasm qaysi ekanligini bilasizmi? Igor Savitskiy bu asarlarni qanday qilib cho'lga yashirgan?"
    },
    {
      name: "Ayozqal'a",
      desc: "Qadimiy Xorazm sirlarini o'zida saqlagan haybatli qumtepa qal'alari.",
      image: "/ayazqala.png", 
      aiTip: "Ming yillar davomida qum barxanlari ostida yashiringan bu qal'ada qanday qilib qadimgi askarlar yashagan va nega uning ikkinchi qismi haligacha to'liq topilmagan?"
    },
    {
      name: "Ustyurt Platosi",
      desc: "O'zga sayyora manzaralarini eslatuvchi mislsiz kanyonlar va jarliklar.",
      image: "/ustyurt.png", 
      aiTip: "Olimlar nega bu yerni Yer sayyorasidagi emas, aynan Marsdagi manzaraga o'xshatishadi? Ming yillik qadimiy okean tubi bo'lgan bu platodan topilgan akula tishlari haqida eshitganmisiz?"
    },
    {
      name: "Chilpik",
      desc: "Zardushtiylarning qadimiy ibodatxonasi. Qoraqalpog'iston gerbidagi ramz.",
      image: "/chilpiq.png", 
      aiTip: "Nega qadimgi zardushtiylar o'z yaqinlarini yerga ko'mmay, aynan mana shu minoraning tepasiga olib chiqib qo'yishganini va 'sukunat minorasi' siri nimadaligini bilasizmi?"
    },
    {
      name: "Nukus Markaziy Bozori",
      desc: "Mahalliy kolorit, noyob qo'l mehnati buyumlari va qoraqalpoq milliy taomlari.",
      image: "/bazar.png", 
      aiTip: "Qoraqalpoq milliy taomlaridan eng sirlisi bo'lgan 'Jo'xori gurtik' ni bozorning qaysi burchagidan topish mumkin va mahalliy xalq uni nega aynan payshanba kuni yeyishini bilasizmi?"
    },
    {
      name: "Mizdakhan majmuasi",
      desc: "Quyosh botishida ajoyib manzara kasb etuvchi qadimiy tarixiy qabriston.",
      image: "/mizdakhan.png", 
      aiTip: "Rivoyatlarga ko'ra, bu yerdagi 'Dunyo soati' deb ataluvchi bino har yili bittadan g'isht yo'qotadi. G'ishtlar tugaganda nima bo'lishi haqidagi qadimiy afsonani eshitishni xohlaysizmi?"
    },
    {
      name: "Sudochye ko‘li",
      desc: "Tabiat ixlosmandlari va noyob qushlarni kuzatish uchun qiziqarli ko'l hududi.",
      image: "/sudochy.png", 
      aiTip: "Cho'l o'rtasidagi bu jannatmakon ko'lda bahor va kuz oylarida noyob pushti flamingolar to'dasini uchratish mumkinligini bilarmidingiz?"
    },
    {
      name: "Qo'yqirilgan qala",
      desc: "Qadimgi Xorazm sivilizatsiyasiga oid dumaloq shakldagi nodir rasadxona.",
      image: "/qoyq.png",
      aiTip: "Ming yillar oldin cho'l o'rtasida qurilgan bu inshoot yulduzlarni kuzatish uchun tarixdagi eng aniq rasadxonalardan biri bo'lgan. Qadimgi munajjimlar sirlarini ochamizmi?"
    },
    {
      name: "Baday-Togai qo‘riqxonasi",
      desc: "Amudaryo sohilidagi noyob to'qayzor o'rmonlari va hayvonot dunyosi.",
      image: "/baday.png", 
      aiTip: "Qizil kitobga kiritilgan Buxoro bug'ulari (Xongul) aynan shu yerda erkin yashaydi. Ularni jonli tabiatda ko'rish uchun qaysi vaqtda borish kerakligini bilasizmi?"
    },
    {
      name: "Jonbosqal'a",
      desc: "Miloddan avvalgi IV asrga oid, mudofaa minoralari bo'lmagan noyob qal'a.",
      image: "/janbas.png", 
      aiTip: "Boshqa barcha qal'alardan farqli o'laroq, bu yerda umuman minora bo'lmagan. Nega qadimgi xorazmliklar bu qal'ani bunday himoyasiz qurishgan? Buning o'ziga xos taktikasi bo'lgan!"
    },
    {
      name: "Shamuratovlar uy-muzeyi",
      desc: "Qoraqalpoq san'ati arboblarining shaxsiy buyumlari va ijodiga bag'ishlangan maskan.",
      image: "/shamurat.png", 
      aiTip: "Bu uy-muzey nafaqat san'at asarlari, balki Qoraqalpog'istonning XX asrdagi eng qiziqarli ziyolilarining yashirin sirlari va muhabbat tarixini o'zida saqlaydi."
    }
  ];

  // 🔥 MODAL UCHUN STATE'LAR
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleAudioPlay = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) {
      alert("Demo: Dastur aynan shu ma'lumotning sirlarini ochuvchi professional AI audio-gidini ishga tushiradi!");
    }
  };

  return (
    <main style={{ minHeight: "100vh", fontFamily: "sans-serif", color: "#1e293b", backgroundColor: "#f8fafc" }}>
      
      {/* HEADER (Menyu) */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Soya qo'shildi */}
        <div style={{ fontSize: "24px", fontWeight: 800, color: "white", letterSpacing: "-1px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          Visit<span style={{ color: "#38bdf8" }}>Karakalpakstan</span>
        </div>
        <div style={{ display: "flex", gap: "30px", fontWeight: 600, fontSize: "15px" }}>
          {/* Matnlarga soya qo'shildi */}
          <a href="#destinations" style={{ cursor: "pointer", color: "#cbd5e1", textDecoration: "none", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Joylar</a>
          <span style={{ cursor: "pointer", color: "#38bdf8", borderBottom: "2px solid #38bdf8", paddingBottom: "4px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Hamroh AI</span>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <div style={{ 
        paddingTop: "140px", paddingBottom: "80px", paddingLeft: "40px", paddingRight: "40px", 
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(to right, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.2) 100%), 
                     url('/creative-karakalpakstan-bg.png') center/cover no-repeat`,
        position: "relative"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)" }}></div>

        <div style={{ maxWidth: "1200px", width: "100%", display: "flex", flexWrap: "wrap", gap: "60px", position: "relative", zIndex: 10 }}>
          <div style={{ flex: "1 1 600px", color: "white" }}>
            
            {/* Rasmiy Turizm Portali (Yorqinlashtirildi va soya qo'shildi) */}
            <div style={{ background: "rgba(56, 189, 248, 0.25)", backdropFilter: "blur(8px)", display: "inline-block", padding: "8px 18px", borderRadius: "20px", fontSize: "14px", fontWeight: 700, marginBottom: "20px", color: "#e0f2fe", border: "1px solid rgba(56, 189, 248, 0.5)", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
              ✨ Rasmiy Turizm Portali
            </div>
            
            {/* Asosiy Sarlavha (Kuchli soya qo'shildi) */}
            <h1 style={{ fontSize: "64px", fontWeight: 900, lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-2px", color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 0 40px rgba(56, 189, 248, 0.3)" }}>
              Sirlarga boy <br/><span style={{ background: "linear-gradient(to right, #38bdf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))" }}>Qoraqalpog'istonni</span> kashf eting
            </h1>
            
            {/* Qo'shimcha matn (Yorqinlashtirildi va soya qo'shildi) */}
            <p style={{ fontSize: "20px", lineHeight: "1.6", color: "#f1f5f9", fontWeight: 500, marginBottom: "40px", maxWidth: "600px", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
              Orol dengizining fojiasi va tabiat mo'jizasi, qadimiy qal'alar va dunyoga mashhur Savitskiy muzeyi. <b style={{color: "white"}}>Hamroh AI</b> yordamida o'z sayohatingizni atigi 1 daqiqada rejalashtiring.
            </p>
            
            <Link href="/wizard" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "18px 36px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "white", fontSize: "18px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4), 0 4px 15px rgba(0,0,0,0.5)", transition: "all 0.3s ease",
                  display: "inline-flex", alignItems: "center", gap: "10px"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.6), 0 4px 15px rgba(0,0,0,0.5)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.4), 0 4px 15px rgba(0,0,0,0.5)"; }}
              >
                Sayohatni boshlash ➔
              </button>
            </Link>

            {/* Statistika (Kuchli soya qo'shildi) */}
            <div style={{ display: "flex", gap: "40px", marginTop: "60px" }}>
              <div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "white", textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}>50+</div>
                <div style={{ color: "#cbd5e1", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Qadimiy qal'alar</div>
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "white", textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}>100K</div>
                <div style={{ color: "#cbd5e1", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Muzey eksponatlari</div>
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "#38bdf8", textShadow: "0 4px 10px rgba(0,0,0,0.8), 0 0 20px rgba(56,189,248,0.4)" }}>AI</div>
                <div style={{ color: "#cbd5e1", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Shaxsiy gid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ETIBORGA LOYIQ JOYLAR GRID */}
      <div id="destinations" style={{ padding: "100px 40px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", letterSpacing: "-1px" }}>
              E'tiborga loyiq manzillar
            </h2>
            <p style={{ color: "#64748b", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Ming yillik tarix va betakror tabiat. Qoraqalpog'istonning eng go'zal va mashhur nuqtalari bilan tanishing.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
            {destinations.map((dest, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedDest(dest)} 
                style={{
                  background: "white", borderRadius: "20px", overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  cursor: "pointer", display: "flex", flexDirection: "column"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ height: "240px", width: "100%", position: "relative" }}>
                  <img src={dest.image} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>{dest.name}</h3>
                  <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}>{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Link href="/wizard" style={{ textDecoration: "none" }}>
              <button style={{ padding: "16px 32px", borderRadius: "12px", border: "2px solid #2563eb", background: "transparent", color: "#2563eb", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#eff6ff"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Barcha joylarni AI orqali kashf etish
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "80px 40px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "50px" }}>
          
          {/* Chap ustun: Brend va Missiya */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "white", marginBottom: "16px", letterSpacing: "-1px" }}>
              Visit<span style={{ color: "#38bdf8" }}>Karakalpakstan</span>
            </div>
            <p style={{ fontSize: "15px", lineHeight: "1.7", maxWidth: "350px", color: "#cbd5e1" }}>
              Qoraqalpog'iston turizm salohiyatini oshirish uchun yaratilgan innovatsion AI startap loyihasi. Tarix va kelajak uchrashgan manzil.
            </p>
          </div>

          {/* O'rta ustun: Tezkor Havolalar */}
          <div style={{ flex: "1 1 200px" }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Loyiha</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "15px", fontWeight: 500 }}>
              <a href="#destinations" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                Asosiy manzillar
              </a>
              <span style={{ cursor: "pointer", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                Hamroh AI (Gid)
              </span>
              <span style={{ cursor: "pointer", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                QR-Skaner (Tez kunda)
              </span>
            </div>
          </div>

          {/* O'ng ustun: Kontaktlar va Dasturchi */}
          <div style={{ flex: "1 1 300px" }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Bog'lanish</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "15px", fontWeight: 500 }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#e2e8f0" }}>
                <span style={{ fontSize: "20px" }}>👨‍💻</span> <span>Shanlibaev Abdirashid</span>
              </div>
              
              <a href="tel:+998945945564" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                <span style={{ fontSize: "20px" }}>📞</span> <span>+998 94 594 55 64</span>
              </a>
              
              <a href="mailto:shanlibaevabdirashid@gmail.com" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                <span style={{ fontSize: "20px" }}>✉️</span> <span>shanlibaevabdirashid@gmail.com</span>
              </a>
              
              <a href="https://t.me/shanlibaev" target="_blank" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="#38bdf8"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>
                <span style={{ fontSize: "20px" }}>✈️</span> <span>@shanlibaev</span>
              </a>

            </div>
          </div>
        </div>

        {/* Eng pastki qism (Copyright va shartlar) */}
        <div style={{ 
          maxWidth: "1200px", margin: "60px auto 0", paddingTop: "24px", 
          borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", 
          flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", fontSize: "14px" 
        }}>
          <div>© 2026 Hamroh AI jamoasi. Barcha huquqlar himoyalangan.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="white"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>Maxfiylik siyosati</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s ease" }} onMouseOver={(e)=>e.currentTarget.style.color="white"} onMouseOut={(e)=>e.currentTarget.style.color="#94a3b8"}>Foydalanish shartlari</span>
          </div>
        </div>
      </footer>

      {/* 🔥 QIZIQARLI MODAL OYNA (Lead Magnet) */}
      {selectedDest && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)",
          zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            width: "100%", maxWidth: "500px", background: "#1e293b", 
            borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.3s ease-out", position: "relative"
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
            
            <button 
              onClick={() => { setSelectedDest(null); setAudioPlaying(false); }} 
              style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.5)", color: "white", border: "none", width: "36px", height: "36px", borderRadius: "50%", fontSize: "16px", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>

            <div style={{ height: "220px", width: "100%", position: "relative" }}>
              <img src={selectedDest.image} alt={selectedDest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(15,23,42,1))", padding: "30px 24px 16px 24px" }}>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "white" }}>{selectedDest.name}</h2>
              </div>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Audio Gid Widget */}
              <div style={{ background: "#0f172a", borderRadius: "16px", padding: "16px", marginBottom: "20px", border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>🎧</span> AI Audio-Gid
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button 
                    onClick={handleAudioPlay}
                    style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#3b82f6", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    {audioPlaying ? "⏸" : "▶"}
                  </button>
                  <div style={{ flex: 1, height: "6px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: audioPlaying ? "40%" : "0%", height: "100%", background: "#38bdf8", transition: "width 1s linear" }}></div>
                  </div>
                </div>
              </div>

              {/* Sirli matn (Intriga) */}
              <div style={{ background: "rgba(56, 189, 248, 0.1)", borderLeft: "4px solid #38bdf8", padding: "16px", borderRadius: "0 12px 12px 0", marginBottom: "24px" }}>
                <p style={{ margin: 0, color: "#e2e8f0", fontSize: "15px", lineHeight: "1.6", fontStyle: "italic" }}>
                  "{selectedDest.aiTip}"
                </p>
              </div>

              {/* Conversion Button */}
              <Link href="/wizard" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", padding: "16px", background: "#10b981", color: "white", border: "none",
                  borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer",
                  display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                  boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)"
                }}>
                  📍 Shu yerdan marshrut tuzish
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}