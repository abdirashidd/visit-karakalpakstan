// 1. Sayohatchi (Foydalanuvchi) tanlagan ma'lumotlar formati
export interface TripFormData {
  days: number;
  travelStyle?: string | string[]; // Bir nechta stil tanlanishi mumkin
  budget?: string;
  people?: string;
  region?: string;
}

// 2. Diqqatga sazovor joylar (Places) formati
export interface Place {
  id: number;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  type?: "place";
  category?: string;
  travelTypes: string[];
  budget?: string[];
  people?: string[];
  visitHours?: number;
  bestTime?: string;
  description: string;
  aiTip?: string;
  image: string;
  popularity?: number;
}

// 3. Oshxona va Restoranlar formati
export interface Restaurant {
  id: number;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  type?: "restaurant";
  budget: string[];
  people: string[];
  visitHours?: number;
  cuisine: string;
  description: string;
  image: string;
  popularity?: number;
}

// 4. Mehmonxona va Yotoqxonalar (Hotels) formati
export interface Hotel {
  id: number;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  type?: "hotel";
  budget: string[];
  people?: string[];
  description: string;
  image: string;
  rating: number; // hotels.ts bazasidagi reytingga moslashtirildi
}

// 5. AI tuzib beradigan marshrutning ichki qismlari (Ertalab, tushlik, kechqurun)
export interface PlanItem {
  time: string;
  title?: string;
  description?: string;
  note?: string;
  type?: "place" | "restaurant" | "transport" | "hotel" | "warning"; // "warning" cho'l/ekstremal hududlar uchun
  priceApprox?: string;
  item?: Place | Restaurant | Hotel; // Obyektlarning o'zi tushadi
}

// 6. Bir kunlik to'liq reja
export interface TripDay {
  day: number;
  region: string;
  hotel?: Hotel; // 🔥 Kunning eng tepasida ko'rsatiladigan turar joy!
  whyThisPlan?: string;
  items: PlanItem[];
}

// 7. Barcha kunlarni o'z ichiga olgan yakuniy reja
export interface TripPlan {
  days: TripDay[];
}