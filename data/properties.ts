export type Property = {
  slug: string;
  title: string;
  city: string;
  district: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor: string;
  orientation: string;
  terrace: boolean;
  instantReserve: boolean;
  verified: boolean;
  match: number;
  agency: string;
  image: string;
  images: string[];
  description: string;
  reservationFee: number;
  optionPremium: number;
  visitWindow: string;
  tags: string[];
};

export const properties: Property[] = [
  {
    slug: "eix-macia-south-terrace",
    title: "Bright south-facing home with terrace",
    city: "Sabadell",
    district: "Eix Macià",
    price: 329000,
    bedrooms: 3,
    bathrooms: 2,
    area: 104,
    floor: "5th",
    orientation: "South",
    terrace: true,
    instantReserve: true,
    verified: true,
    match: 98,
    agency: "Nova Habitat",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A quiet, light-filled home with an open living area, generous terrace and afternoon sun. The property is transaction-ready and has been verified for Instant Reserve.",
    reservationFee: 1000,
    optionPremium: 120,
    visitWindow: "72 hours",
    tags: ["Terrace", "Lift", "Parking option", "Natural light"]
  },
  {
    slug: "centre-renovated-corner",
    title: "Renovated corner apartment near the centre",
    city: "Sabadell",
    district: "Centre",
    price: 295000,
    bedrooms: 3,
    bathrooms: 2,
    area: 96,
    floor: "3rd",
    orientation: "South-east",
    terrace: false,
    instantReserve: true,
    verified: true,
    match: 94,
    agency: "Brava Living",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Recently renovated with a calm neutral palette, three full bedrooms and a practical layout. Close to services and transport while remaining on a quiet street.",
    reservationFee: 850,
    optionPremium: 100,
    visitWindow: "72 hours",
    tags: ["Renovated", "Lift", "Corner unit", "Quiet street"]
  },
  {
    slug: "creu-alta-family-home",
    title: "Family apartment with open views",
    city: "Sabadell",
    district: "Creu Alta",
    price: 348000,
    bedrooms: 4,
    bathrooms: 2,
    area: 118,
    floor: "6th",
    orientation: "South-west",
    terrace: true,
    instantReserve: true,
    verified: true,
    match: 91,
    agency: "Finques Vallès",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Large family home with open urban views, an efficient floor plan and a sunny terrace. Ideal for buyers prioritising space without leaving Sabadell.",
    reservationFee: 1200,
    optionPremium: 140,
    visitWindow: "72 hours",
    tags: ["4 bedrooms", "Terrace", "Lift", "Views"]
  },
  {
    slug: "gracia-patio-loft",
    title: "Character apartment with private patio",
    city: "Barcelona",
    district: "Gràcia",
    price: 465000,
    bedrooms: 2,
    bathrooms: 1,
    area: 79,
    floor: "Ground",
    orientation: "East",
    terrace: true,
    instantReserve: false,
    verified: true,
    match: 79,
    agency: "Casa Clara",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Warm textures, a private patio and an unusually calm interior in the heart of Gràcia. Viewings are available through the seller but Instant Reserve is not enabled yet.",
    reservationFee: 0,
    optionPremium: 0,
    visitWindow: "By appointment",
    tags: ["Private patio", "Character", "Quiet", "Central"]
  },
  {
    slug: "sant-cugat-green-view",
    title: "Modern home beside green space",
    city: "Sant Cugat",
    district: "Volpelleres",
    price: 525000,
    bedrooms: 3,
    bathrooms: 2,
    area: 112,
    floor: "4th",
    orientation: "South",
    terrace: true,
    instantReserve: true,
    verified: true,
    match: 88,
    agency: "Oak Real Estate",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Modern, efficient and bright with a generous terrace facing green space. Includes community pool and quick rail access into Barcelona.",
    reservationFee: 1500,
    optionPremium: 150,
    visitWindow: "72 hours",
    tags: ["Terrace", "Pool", "Energy efficient", "Parking"]
  },
  {
    slug: "terrassa-centre-sunlight",
    title: "Calm three-bedroom home with sunlight",
    city: "Terrassa",
    district: "Centre",
    price: 269000,
    bedrooms: 3,
    bathrooms: 2,
    area: 101,
    floor: "4th",
    orientation: "South",
    terrace: false,
    instantReserve: true,
    verified: true,
    match: 86,
    agency: "Habitat 360",
    image: "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A simple, bright and well-proportioned home close to Terrassa centre. South-facing living room and excellent value per square metre.",
    reservationFee: 800,
    optionPremium: 90,
    visitWindow: "72 hours",
    tags: ["South-facing", "Lift", "Good value", "Central"]
  }
];

export const formatPrice = (price: number) => new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
}).format(price);
