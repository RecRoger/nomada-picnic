import { PlacesTypes } from "../enums";

export interface IPlaceLocation {
  lat: number;
  lng: number;
}

export interface IPlace {
  _id?: string;
  name: string;
  type: PlacesTypes;
  description?: string;
  images?: string[];
  location?: IPlaceLocation;
  mapsLink?: string;
  zone: number;
  transportationCost: number;
}