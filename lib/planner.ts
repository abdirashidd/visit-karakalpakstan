import { places } from "../data/places";
import { restaurants } from "../data/restaurants";
import { hotels } from "../data/hotels"; // 🔥 Mehmonxonalar bazasi import qilindi
import { Place, Restaurant, Hotel, TripFormData } from "../types"; // 🔥 Hotel turi qo'shildi

export type PlanItem = {
  time: string;
  item: Place | Restaurant;
  note?: string;
};

export type DayPlan = {
  day: number;
  region: string;
  hotel?: Hotel; // 🔥 Kunning eng tepasida chiqadigan mehmonxona
  items: PlanItem[];
};

export type TripPlan = {
  days: DayPlan[];
};

function matchesBudget(list: string[] | undefined, budget?: string) {
  if (!budget) return true;
  if (!list || list.length === 0) return true; // Agar joyda byudjet belgilanmagan bo'lsa (masalan Orol dengizi), hammaga mos deb oladi
  return list.includes(budget);
}

function matchesPeople(list: string[] | undefined, people?: string) {
  if (!people) return true;
  if (!list || list.length === 0) return true; // Agar odam soni belgilanmagan bo'lsa, hammaga mos deb oladi
  return list.includes(people);
}

function addTime(startTime: string, hoursToAdd: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMinutes = Math.round(h * 60 + m + hoursToAdd * 60);
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

function getGroupTip(people?: string): string {
  if (people === "1") return "Yolg'iz sayohatchilar uchun qulay va harakatlanish oson.";
  if (people === "2-3") return "Do'stlar yoki juftliklar uchun ajoyib xotiralar qoldiradigan maskan.";
  if (people === "4+") return "Katta guruh bo'lganingiz uchun restoran/joylarni oldindan band qilishni unutmang.";
  return "Ajoyib sayohat tilaymiz!";
}

function getTimeMultiplier(people?: string): number {
  if (people === "1") return 0.8;
  if (people === "4+") return 1.3;
  return 1.0;
}

// Ikkita koordinata (GPS) orasidagi masofani kilometrda o'lchaydigan formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Yerning radiusi (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Kilometrdagi masofa
}

// Turist turgan nuqtaga eng yaqin restoranni aniqlash
function getClosestRestaurant(lat: number, lng: number, budget?: string, people?: string) {
  let closest: Restaurant | null = null;
  let minDistance = Infinity;

  for (const r of restaurants) {
    if (matchesBudget(r.budget, budget) && matchesPeople(r.people, people)) {
      const dist = getDistance(lat, lng, r.lat, r.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = r;
      }
    }
  }
  return { restaurant: closest, distance: minDistance };
}

// 🔥 YANGILIK: Hudud va byudjetga mos eng yaxshi mehmonxonani topish
function getHotelByRegion(region: string, budget?: string) {
  const matchingHotels = hotels.filter(h => h.region === region && matchesBudget(h.budget, budget));
  if (matchingHotels.length > 0) {
    // Agar mos kelsa, reytingi eng balandini beramiz
    return matchingHotels.sort((a, b) => b.rating - a.rating)[0];
  }
  // Agar byudjetga mosi topilmasa, shu regiondagi istalgan bittasini beramiz
  const anyHotelInRegion = hotels.filter(h => h.region === region);
  return anyHotelInRegion.length > 0 ? anyHotelInRegion.sort((a, b) => b.rating - a.rating)[0] : undefined;
}

export function generateTripPlan(formData: TripFormData): TripPlan {
  const selectedStyles: string[] = Array.isArray(formData.travelStyle)
    ? formData.travelStyle
    : (formData.travelStyle ? [formData.travelStyle as string] : []);

  const filteredPlaces = places
    .filter((place) => {
      if (selectedStyles.length === 0) return true;
      return selectedStyles.some((selectedType: string) => place.travelTypes.includes(selectedType));
    })
    .filter((place) => matchesBudget(place.budget, formData.budget))
    .filter((place) => matchesPeople(place.people, formData.people))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const totalDays = formData.days || 1;

  if (filteredPlaces.length === 0) {
    const fallbackDays: DayPlan[] = Array.from({ length: totalDays }, (_, index) => ({
      day: index + 1,
      region: "Nukus",
      items: [],
    }));
    return { days: fallbackDays };
  }

  const dayBuckets: Place[][] = Array.from({ length: totalDays }, () => []);

  filteredPlaces.forEach((place, index) => {
    dayBuckets[index % totalDays].push(place);
  });

  const days: DayPlan[] = dayBuckets.map((dayPlaces, index) => {
    const normalizedPlaces = dayPlaces.length > 0 ? dayPlaces : [filteredPlaces[index % filteredPlaces.length]];
    let placesForDay = normalizedPlaces.slice(0, 3);

    // OPTIMAL MARSHRUT YARATISH: Joylarni geografik joylashuviga (masofasiga) qarab ketma-ket taxlaymiz!
    if (placesForDay.length > 1) {
      const sorted = [placesForDay[0]]; // Birinchi joyni asos qilamiz
      const remaining = placesForDay.slice(1);

      while (remaining.length > 0) {
        const lastPlace = sorted[sorted.length - 1];
        let closestIdx = 0;
        let minDist = Infinity;
        
        // Qolgan joylar orasidan eng yaqinini qidiramiz
        for (let i = 0; i < remaining.length; i++) {
          const dist = getDistance(lastPlace.lat, lastPlace.lng, remaining[i].lat, remaining[i].lng);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = i;
          }
        }
        
        sorted.push(remaining[closestIdx]);
        remaining.splice(closestIdx, 1);
      }
      placesForDay = sorted; // Tartiblangan ro'yxatni saqlaymiz
    }

    const region = placesForDay[0]?.region || "Nukus";
    const items: PlanItem[] = [];

    let currentTime = "09:30"; 
    const timeMultiplier = getTimeMultiplier(formData.people);
    const groupTip = getGroupTip(formData.people);
    let isLunchAdded = false;

    placesForDay.forEach((place) => {
      // TUSHLIK QO'SHISH VA 25 KM MASOFA TEKSHIRUVI
      if (!isLunchAdded && currentTime >= "12:30") {
        const { restaurant: lunchRestaurant, distance } = getClosestRestaurant(place.lat, place.lng, formData.budget, formData.people);
        
        if (lunchRestaurant) {
          if (distance > 25) {
            items.push({
              time: currentTime,
              item: {
                id: 9999,
                name: "🏜️ Ekstremal hudud: O'zingiz bilan tushlik oling!",
                city: place.city,
                region: place.region,
                lat: place.lat, 
                lng: place.lng, 
                type: "restaurant",
                budget: ["past"],
                people: ["1", "2-3", "4+"],
                visitHours: 1,
                cuisine: "maxsus",
                description: `Diqqat! Atrofda (${distance.toFixed(0)} km radiusda) rasmiy oshxonalar yo'q. Qorin och qolmasligi uchun o'zingiz bilan tushlik (sneklar, sendvichlar) va yetarlicha suv olib olishingizni qat'iy tavsiya qilamiz!`,
                image: "/restaurants/no-food.jpg",
                popularity: 5,
              } as Restaurant,
              note: `Muhim eslatma! ⚠️ ${groupTip}`,
            });
          } else {
            items.push({
              time: currentTime,
              item: lunchRestaurant,
              note: `Tushlik vaqti! 🍽️ (Masofa: ${distance.toFixed(1)} km) 💡 ${groupTip}`,
            });
          }
          currentTime = addTime(currentTime, 1.5 * timeMultiplier);
          isLunchAdded = true;
        }
      }

      items.push({
        time: currentTime,
        item: place,
        note: `${place.aiTip || ""} 💡 ${groupTip}`,
      });

      const spentHours = (place.visitHours || 1.5) * timeMultiplier;
      currentTime = addTime(currentTime, spentHours + 0.5);
    });

    // Agar tushlik tsikl ichida qo'shilmay qolgan bo'lsa
    if (!isLunchAdded && placesForDay.length > 0) {
      const lastPlace = placesForDay[placesForDay.length - 1];
      const { restaurant: lunchRestaurant, distance } = getClosestRestaurant(lastPlace.lat, lastPlace.lng, formData.budget, formData.people);
      
      if (lunchRestaurant) {
        if (currentTime < "13:00") currentTime = "13:30"; 
        
        if (distance > 25) {
          items.push({
            time: currentTime,
            item: {
              id: 9999,
              name: "🏜️ Ekstremal hudud: O'zingiz bilan ovqat oling!",
              city: lastPlace.city,
              region: lastPlace.region,
              lat: lastPlace.lat,
              lng: lastPlace.lng,
              type: "restaurant",
              budget: ["past"],
              people: ["1", "2-3", "4+"],
              visitHours: 1,
              cuisine: "maxsus",
              description: `Diqqat! Atrofda (${distance.toFixed(0)} km radiusda) rasmiy oshxonalar yo'q. Qorin och qolmasligi uchun o'zingiz bilan yetarlicha ovqat va suv oling!`,
              image: "/restaurants/no-food.jpg",
              popularity: 5,
            } as Restaurant,
            note: `Sayohatdan so'ng ehtiyot chorasi! ⚠️ ${groupTip}`,
          });
        } else {
          items.push({
            time: currentTime,
            item: lunchRestaurant,
            note: `Sayohatdan so'ng maza qilib ovqatlanamiz! 🍽️ (Masofa: ${distance.toFixed(1)} km) 💡 ${groupTip}`,
          });
        }
      }
    }

    return {
      day: index + 1,
      region,
      hotel: getHotelByRegion(region, formData.budget), // 🔥 Mehmonxona shu yerda bog'landi
      items,
    };
  });

  return { days };
}