import { Hotel } from "../types";

export const hotels: Hotel[] = [
  // --- NUKUS HUDUDI ---
  {
    id: 201,
    name: "Jipek Joli Inn",
    city: "Nukus",
    region: "Nukus",
    lat: 42.46320,
    lng: 59.61450,
    budget: ["ortacha", "yuqori"],
    description: "Nukus markazidagi eng mashhur, milliy qoraqalpoq naqshlari bilan bezatilgan premium mehmonxona. Nonushta va ajoyib xizmat ko'rsatish mavjud.",
    image: "/hotels/jipek-joli.jpg",
    rating: 4.8,
  },
  {
    id: 202,
    name: "Hotel Tashkent",
    city: "Nukus",
    region: "Nukus",
    lat: 42.46010,
    lng: 59.61720,
    budget: ["ortacha"],
    description: "Savitskiy muzeyiga piyoda yurish masofasida joylashgan, barcha qulayliklarga ega zamonaviy va shinam mehmonxona.",
    image: "/hotels/tashkent-hotel.jpg",
    rating: 4.2,
  },
  {
    id: 203,
    name: "Besqala Hostel",
    city: "Nukus",
    region: "Nukus",
    lat: 42.46580,
    lng: 59.61090,
    budget: ["past"],
    description: "Arzon byudjetli sayyohlar va yoshlar uchun qulay hostel. Toza yotoqjoylar va umumiy oshxona mavjud.",
    image: "/hotels/besqala-hostel.jpg",
    rating: 4.5,
  },

  // --- MO'YNOQ HUDUDI ---
  {
    id: 204,
    name: "Muynak Hostel (Mayak)",
    city: "Mo'ynoq",
    region: "Mo'ynoq",
    lat: 43.76650,
    lng: 59.02380,
    budget: ["past", "ortacha"],
    description: "Kemalar qabristoni tepasida joylashgan yagona shinam hostel. Dengiz o'rnidagi cho'l manzarasini tomosha qilish uchun ideal joy.",
    image: "/hotels/muynak-hostel.jpg",
    rating: 4.4,
  },
  {
    id: 205,
    name: "Aral Sea Yurt Camp",
    city: "Mo'ynoq",
    region: "Mo'ynoq",
    lat: 45.01220,
    lng: 58.27110,
    budget: ["ortacha", "yuqori"],
    description: "Orol dengizining hozirgi qirg'og'ida tunash uchun maxsus qoraqalpoq o'tovlari. Tungi yulduzli osmon va gulxan atrofida romantik hordiq.",
    image: "/hotels/aral-yurt.jpg",
    rating: 4.9,
  },

  // --- ELLIKQAL'A HUDUDI ---
  {
    id: 206,
    name: "Ayaz-Kala Yurt Camp",
    city: "Ellikqala",
    region: "Ellikqala",
    lat: 42.01050,
    lng: 61.02550,
    budget: ["past", "ortacha", "yuqori"],
    description: "Qadimiy Ayozqal'a xarobalari yonidagi tarixiy o'tovlar. Qadimgi ko'chmanchilar hayotini his qilish va cho'lda tunash imkoniyati.",
    image: "/hotels/ayaz-yurt.jpg",
    rating: 4.7,
  },

  // --- QO'NG'IROT / USTYURT HUDUDI ---
  {
    id: 207,
    name: "Kungrad Hotel",
    city: "Qo‘ng‘irot",
    region: "Qo‘ng‘irot",
    lat: 43.04700,
    lng: 58.84800,
    budget: ["past", "ortacha"],
    description: "Ustyurt platosi va Sudochye ko'li safariga chiqishdan oldin tunab qolish uchun Qo'ng'irot shahridagi qulay mehmonxona.",
    image: "/hotels/kungrad-hotel.jpg",
    rating: 4.0,
  }
];