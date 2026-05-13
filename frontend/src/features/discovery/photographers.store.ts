import { create } from "zustand";

interface FilterValues {
  search: string;
  location: string;
  specialties: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
}

interface PhotographerFiltersState extends FilterValues {
  // Committed Setters (Immediate Sync)
  setSearch: (value: string) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setPage: (value: number) => void;

  // Draft State (The "Truth" for UI selections)
  drafts: {
    location: string;
    specialties: string[];
    minPrice: string;
    maxPrice: string;
  };
  setDraftLocation: (value: string) => void;
  toggleDraftSpecialty: (value: string) => void;
  setDraftMinPrice: (value: string) => void;
  setDraftMaxPrice: (value: string) => void;
  
  // Actions
  applyFilters: () => void;
  reset: () => void;
  hydrateFromURL: () => void;
  hasActiveFilters: boolean;
}

const DEFAULTS: FilterValues = {
  search: "",
  location: "all",
  specialties: [],
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
};

export function readFiltersFromURL(): Partial<FilterValues> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const parsed: Partial<FilterValues> = {};
  if (params.get("search")) parsed.search = params.get("search")!;
  if (params.get("location")) parsed.location = params.get("location")!;
  const specs = params.get("specialty");
  if (specs) parsed.specialties = specs.split(",");
  if (params.get("minPrice")) parsed.minPrice = params.get("minPrice")!;
  if (params.get("maxPrice")) parsed.maxPrice = params.get("maxPrice")!;
  if (params.get("sortBy")) parsed.sortBy = params.get("sortBy")!;
  const order = params.get("sortOrder");
  if (order === "asc" || order === "desc") parsed.sortOrder = order;
  const page = params.get("page");
  if (page) {
    const n = parseInt(page, 10);
    if (!Number.isNaN(n) && n >= 1) parsed.page = n;
  }
  return parsed;
}

export function writeFiltersToURL(state: FilterValues) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.location !== "all") params.set("location", state.location);
  if (state.specialties.length > 0) params.set("specialty", state.specialties.join(","));
  if (state.minPrice) params.set("minPrice", state.minPrice);
  if (state.maxPrice) params.set("maxPrice", state.maxPrice);
  if (state.sortBy !== DEFAULTS.sortBy) params.set("sortBy", state.sortBy);
  if (state.sortOrder !== DEFAULTS.sortOrder) params.set("sortOrder", state.sortOrder);
  if (state.page > 1) params.set("page", String(state.page));
  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

function syncAndNotify(
  set: (partial: Partial<PhotographerFiltersState>) => void,
  get: () => PhotographerFiltersState,
  partial: Partial<FilterValues>
) {
  set(partial);
  const next = get();
  const hasActive = 
    next.search !== DEFAULTS.search ||
    next.location !== DEFAULTS.location ||
    next.specialties.length > 0 ||
    next.minPrice !== DEFAULTS.minPrice ||
    next.maxPrice !== DEFAULTS.maxPrice;
  set({ hasActiveFilters: hasActive });
  
  const { search, location, specialties, minPrice, maxPrice, sortBy, sortOrder, page } = next;
  writeFiltersToURL({ search, location, specialties, minPrice, maxPrice, sortBy, sortOrder, page });
}

let searchTimeout: NodeJS.Timeout;

export const usePhotographerFilters = create<PhotographerFiltersState>((set, get) => ({
  ...DEFAULTS,
  hasActiveFilters: false,
  
  drafts: {
    location: DEFAULTS.location,
    specialties: DEFAULTS.specialties,
    minPrice: DEFAULTS.minPrice,
    maxPrice: DEFAULTS.maxPrice,
  },

  setSearch: (value) => {
    set({ search: value, page: 1 });
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      syncAndNotify(set, get, { search: get().search });
    }, 400);
  },

  setSortBy: (value) => syncAndNotify(set, get, { sortBy: value, page: 1 }),
  setSortOrder: (value) => syncAndNotify(set, get, { sortOrder: value, page: 1 }),
  setPage: (value) => syncAndNotify(set, get, { page: value }),

  // Draft Setters (The "Truth" for UI changes)
  setDraftLocation: (value) => set((s) => ({ drafts: { ...s.drafts, location: value } })),
  toggleDraftSpecialty: (value) => set((s) => {
    const current = s.drafts.specialties;
    const next = current.includes(value) ? current.filter(x => x !== value) : [...current, value];
    return { drafts: { ...s.drafts, specialties: next } };
  }),
  setDraftMinPrice: (value) => set((s) => ({ drafts: { ...s.drafts, minPrice: value } })),
  setDraftMaxPrice: (value) => set((s) => ({ drafts: { ...s.drafts, maxPrice: value } })),

  applyFilters: () => {
    const { drafts } = get();
    syncAndNotify(set, get, {
      location: drafts.location,
      specialties: drafts.specialties,
      minPrice: drafts.minPrice,
      maxPrice: drafts.maxPrice,
      page: 1,
    });
  },

  reset: () => {
    const resetState = { 
      ...DEFAULTS, 
      hasActiveFilters: false,
      drafts: {
        location: DEFAULTS.location,
        specialties: DEFAULTS.specialties,
        minPrice: DEFAULTS.minPrice,
        maxPrice: DEFAULTS.maxPrice,
      }
    };
    set(resetState);
    writeFiltersToURL(DEFAULTS);
  },

  hydrateFromURL: () => {
    const fromURL = readFiltersFromURL();
    if (Object.keys(fromURL).length > 0) {
      const merged = { ...DEFAULTS, ...fromURL };
      set(merged);
      set({
        drafts: {
          location: merged.location,
          specialties: merged.specialties,
          minPrice: merged.minPrice,
          maxPrice: merged.maxPrice,
        }
      });
      const next = get();
      const hasActive = 
        next.search !== DEFAULTS.search ||
        next.location !== DEFAULTS.location ||
        next.specialties.length > 0 ||
        next.minPrice !== DEFAULTS.minPrice ||
        next.maxPrice !== DEFAULTS.maxPrice;
      set({ hasActiveFilters: hasActive });
    }
  },
}));
