import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type PropertyType = "Cabin" | "Beachfront" | "Villa" | "Loft" | "Countryside" | "Tent" | "Ryokan";

export interface Property {
  id: string;
  title: string;
  location: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  type: PropertyType;
  beds: number;
  baths: number;
  guests: number;
  host: string;
  superhost: boolean;
  description: string;
  images: string[];
  amenities: string[];
}

export const properties: Property[] = [
  {
    id: "1",
    title: "A-Frame Cabin in the Pines",
    location: "Lake Tahoe, California",
    country: "United States",
    price: 184,
    rating: 4.92,
    reviews: 218,
    type: "Cabin",
    beds: 2,
    baths: 1,
    guests: 4,
    host: "Marcus",
    superhost: true,
    description:
      "Wake up to pine-scented mornings inside a handcrafted A-frame. Fireplace, hot cocoa and snowy decks await.",
    images: [p1, p5, p7, p8],
    amenities: ["Wifi", "Fireplace", "Kitchen", "Free parking", "Hot tub"],
  },
  {
    id: "2",
    title: "Caldera House with Blue Domes",
    location: "Oia, Santorini",
    country: "Greece",
    price: 412,
    rating: 4.97,
    reviews: 540,
    type: "Villa",
    beds: 3,
    baths: 2,
    guests: 6,
    host: "Eleni",
    superhost: true,
    description:
      "Whitewashed terraces, golden Aegean sunsets and a private plunge pool overlooking the caldera.",
    images: [p2, p3, p5, p4],
    amenities: ["Pool", "Sea view", "Wifi", "Kitchen", "AC"],
  },
  {
    id: "3",
    title: "Overwater Bungalow on the Reef",
    location: "North Malé Atoll",
    country: "Maldives",
    price: 689,
    rating: 4.99,
    reviews: 312,
    type: "Beachfront",
    beds: 1,
    baths: 1,
    guests: 2,
    host: "Aiman",
    superhost: true,
    description:
      "Step from your deck straight into turquoise water. Glass-floor lounge, outdoor shower and sunrise yoga.",
    images: [p3, p2, p1, p6],
    amenities: ["Beachfront", "Snorkeling", "Wifi", "Breakfast", "AC"],
  },
  {
    id: "4",
    title: "SoHo Skyline Loft",
    location: "Manhattan, New York",
    country: "United States",
    price: 296,
    rating: 4.85,
    reviews: 174,
    type: "Loft",
    beds: 1,
    baths: 1,
    guests: 3,
    host: "Priya",
    superhost: false,
    description:
      "Industrial loft with floor-to-ceiling windows, designer furniture and an unbeatable downtown skyline view.",
    images: [p4, p1, p7, p8],
    amenities: ["Wifi", "Workspace", "Elevator", "Gym", "Doorman"],
  },
  {
    id: "5",
    title: "Tuscan Stone Farmhouse",
    location: "Val d'Orcia, Tuscany",
    country: "Italy",
    price: 238,
    rating: 4.94,
    reviews: 402,
    type: "Countryside",
    beds: 4,
    baths: 3,
    guests: 8,
    host: "Lorenzo",
    superhost: true,
    description:
      "Cypress-lined drives, vineyards at sunset and slow Italian breakfasts on the terracotta terrace.",
    images: [p5, p2, p7, p1],
    amenities: ["Pool", "Vineyard", "Wifi", "Kitchen", "Pet friendly"],
  },
  {
    id: "6",
    title: "Joshua Tree Glamping Tent",
    location: "Joshua Tree, California",
    country: "United States",
    price: 142,
    rating: 4.78,
    reviews: 96,
    type: "Tent",
    beds: 1,
    baths: 1,
    guests: 2,
    host: "Sasha",
    superhost: false,
    description:
      "Stargaze from a king bed under the desert sky. Fire pit, French press coffee and silence included.",
    images: [p6, p1, p8, p5],
    amenities: ["Fire pit", "Stargazing", "BBQ", "Outdoor shower"],
  },
  {
    id: "7",
    title: "Kyoto Ryokan with Koi Garden",
    location: "Higashiyama, Kyoto",
    country: "Japan",
    price: 268,
    rating: 4.96,
    reviews: 287,
    type: "Ryokan",
    beds: 2,
    baths: 1,
    guests: 4,
    host: "Haruki",
    superhost: true,
    description:
      "A traditional ryokan with tatami rooms, a private onsen and red maples reflected in the koi pond.",
    images: [p7, p2, p5, p1],
    amenities: ["Onsen", "Garden", "Tea ceremony", "Wifi", "Breakfast"],
  },
  {
    id: "8",
    title: "Black Cabin on the Black Sand Coast",
    location: "Vík í Mýrdal",
    country: "Iceland",
    price: 221,
    rating: 4.88,
    reviews: 162,
    type: "Cabin",
    beds: 2,
    baths: 1,
    guests: 4,
    host: "Ingrid",
    superhost: true,
    description:
      "Storm-watching, geothermal hot tubs and northern lights from a sleek architectural retreat.",
    images: [p8, p1, p5, p7],
    amenities: ["Hot tub", "Wifi", "Kitchen", "Heating", "Aurora view"],
  },
];

export const categories = [
  { id: "all", label: "All", icon: "🌍" },
  { id: "Beachfront", label: "Beachfront", icon: "🏝️" },
  { id: "Cabin", label: "Cabins", icon: "🛖" },
  { id: "Villa", label: "Villas", icon: "🏛️" },
  { id: "Loft", label: "Lofts", icon: "🏙️" },
  { id: "Countryside", label: "Countryside", icon: "🌾" },
  { id: "Tent", label: "Glamping", icon: "⛺" },
  { id: "Ryokan", label: "Ryokan", icon: "🍵" },
] as const;