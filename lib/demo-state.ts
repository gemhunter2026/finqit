export type AgentConfig = {
  active: boolean;
  location: string;
  radiusKm: number;
  maxPrice: number;
  reservationLimit: number;
  hardRules: string[];
  authorised: boolean;
  updatedAt: string;
};

export type ReservationRecord = {
  reference: string;
  propertySlug: string;
  propertyTitle: string;
  reservationFee: number;
  optionPremium: number;
  refundableAmount: number;
  visitWindow: string;
  startedAt: string;
  status: "active" | "released" | "proceeded";
};

export type SellerListing = {
  id: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  area: number;
  sellerType: "agency" | "owner";
  agency: string;
  instantReserve: boolean;
  reservationFee: number;
  optionPremium: number;
  windowHours: number;
  status: "pending" | "verified" | "live";
  createdAt: string;
};

const KEYS = {
  saved: "finqit:saved-homes",
  agent: "finqit:agent-config",
  reservation: "finqit:active-reservation",
  listings: "finqit:seller-listings"
} as const;

export const FINQIT_STATE_EVENT = "finqit:state";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(FINQIT_STATE_EVENT, { detail: { key } }));
}

export function getSavedHomes() {
  return readJson<string[]>(KEYS.saved, []);
}

export function setSavedHomes(slugs: string[]) {
  writeJson(KEYS.saved, Array.from(new Set(slugs)));
}

export function toggleSavedHome(slug: string) {
  const current = getSavedHomes();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  setSavedHomes(next);
  return next;
}

export function getAgentConfig(): AgentConfig {
  return readJson<AgentConfig>(KEYS.agent, {
    active: false,
    location: "Sabadell",
    radiusKm: 8,
    maxPrice: 350000,
    reservationLimit: 1200,
    hardRules: ["South-facing", "3+ bedrooms", "Terrace"],
    authorised: false,
    updatedAt: new Date(0).toISOString()
  });
}

export function saveAgentConfig(config: Omit<AgentConfig, "updatedAt">) {
  const next: AgentConfig = { ...config, updatedAt: new Date().toISOString() };
  writeJson(KEYS.agent, next);
  return next;
}

export function getActiveReservation() {
  const reservation = readJson<ReservationRecord | null>(KEYS.reservation, null);
  return reservation?.status === "active" ? reservation : null;
}

export function setActiveReservation(reservation: ReservationRecord) {
  writeJson(KEYS.reservation, reservation);
}

export function clearActiveReservation(status: ReservationRecord["status"] = "released") {
  const current = readJson<ReservationRecord | null>(KEYS.reservation, null);
  if (!current) return;
  writeJson(KEYS.reservation, { ...current, status });
}

export function getSellerListings() {
  return readJson<SellerListing[]>(KEYS.listings, []);
}

export function addSellerListing(listing: Omit<SellerListing, "id" | "createdAt" | "status">) {
  const next: SellerListing = {
    ...listing,
    id: `FQL-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "pending"
  };
  writeJson(KEYS.listings, [next, ...getSellerListings()]);
  return next;
}

export function updateSellerListingStatus(id: string, status: SellerListing["status"]) {
  const next = getSellerListings().map((listing) => listing.id === id ? { ...listing, status } : listing);
  writeJson(KEYS.listings, next);
  return next;
}
