import { PLACES_TYPES } from "../enums/places-types.enum";

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlaceDto {
  _id?: string;
  name: string;
  type: PLACES_TYPES
  description: string;
  images: string[];
  location?: PlaceLocation[];
  mapsLink: string;
  zone?: number;
  transportationCost: number;
}