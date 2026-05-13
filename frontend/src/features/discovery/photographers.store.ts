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
  setSearch: (value: string) => void;
  setLocation: (value: string) => void;
  toggleSpecialty: (value: string) => void;
  setSpecialties: (values: string[]) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setPage: (value: number) => void;
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



function setAndSync(
  set: (partial: Partial<PhotographerFiltersState>) => void,
  get: () => PhotographerFiltersState,
  partial: Partial<FilterValues>,
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

  setSearch: (value) => {
    set({ search: value, page: 1 });
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setAndSync(set, get, { search: get().search });
    }, 400);
  },

  setLocation: (value) => setAndSync(set, get, { location: value, page: 1 }),
  
  toggleSpecialty: (value) => {
    const current = get().specialties;
    const next = current.includes(value)
      ? current.filter(s => s !== value)
      : [...current, value];
    setAndSync(set, get, { specialties: next, page: 1 });
  },

  setSpecialties: (values) => setAndSync(set, get, { specialties: values, page: 1 }),
  setMinPrice: (value) => setAndSync(set, get, { minPrice: value, page: 1 }),
  setMaxPrice: (value) => setAndSync(set, get, { maxPrice: value, page: 1 }),
  setSortBy: (value) => setAndSync(set, get, { sortBy: value, page: 1 }),
  setSortOrder: (value) => setAndSync(set, get, { sortOrder: value, page: 1 }),
  setPage: (value) => setAndSync(set, get, { page: value }),

  reset: () => {
    set({ ...DEFAULTS, hasActiveFilters: false });
    writeFiltersToURL(DEFAULTS);
  },

  hydrateFromURL: () => {
    const fromURL = readFiltersFromURL();
    if (Object.keys(fromURL).length > 0) {
      set(fromURL);
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
