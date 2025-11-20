export type TravelItem = {
  month: string;
  destination: string;
  country: string;
  category_raw: string;
  reason_he: string;
  // later we may add lat/lng
};

export type Coordinates = {
  lat: number;
  lng: number;
};

