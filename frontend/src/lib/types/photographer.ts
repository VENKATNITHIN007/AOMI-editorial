export interface UserSummary {
  _id: string;
  fullName: string;
  avatar?: string | null;
  email?: string;
}

export interface PhotographerListItem {
  _id: string;
  userId: UserSummary;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
  thumbnailUrl?: string | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PhotographerProfile {
  _id: string;
  userId: UserSummary;
  username: string;
  bio?: string;
  location?: string;
  instagram?: string;
  heroTagline?: string;
  specialties: string[];
  priceFrom?: number;
}

export interface PortfolioItem {
  _id: string;
  photographerId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  purpose: "gallery" | "hero" | "about" | "thumbnail";
  createdAt?: string;
}

export interface PhotographerFullData {
  profile: PhotographerProfile;
  hero: PortfolioItem | null;
  aboutImage: PortfolioItem | null;
  thumbnail: PortfolioItem | null;
  gallery: PortfolioItem[];
}

