import { PlacesTypes } from "@enums/places-types.enum";

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlaceDto {
  _id?: string;
  name: string;
  type: PlacesTypes
  description: string;
  images: string[];
  location?: PlaceLocation;
  mapsLink: string;
  zone?: number;
  transportationCost: number;
}