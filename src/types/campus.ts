export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export type FoodCategory =
  | 'All'
  | 'Meals & Thali'
  | 'South Indian'
  | 'Rolls & Wraps'
  | 'Snacks & Quick Bites'
  | 'Sandwiches & Burgers'
  | 'Beverages & Shakes';

export type DietaryType = 'veg' | 'non-veg' | 'beverage';

export interface Outlet {
  id: string;
  name: string;
  tagline: string;
  location: string;
  hours: string;
  isOpen: boolean;
  contactNumber?: string;
  distanceMinutes: number; // e.g. 3 min walk from Library
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; // In INR
  outletId: string;
  outletName: string;
  category: Exclude<FoodCategory, 'All'>;
  dietary: DietaryType;
  availability: AvailabilityStatus;
  stockCount?: number; // Only relevant when availability is 'limited' or tracked
  unitName?: string; // e.g. "plates", "portions", "cups", "rolls"
  lastUpdated: string; // ISO date string
  imageUrl?: string;
  estimatedPrepTimeMinutes?: number;
}

export interface FilterOptions {
  searchQuery: string;
  category: FoodCategory;
  outletId: string; // 'all' or specific outlet ID
  availability: 'all' | AvailabilityStatus;
  dietary: 'all' | DietaryType;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'availability' | 'recently-updated';
}
