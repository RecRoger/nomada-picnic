import { CostsTypes } from "../enums";

export interface ICost {
  _id?: string;
  name: string;
  type: CostsTypes;
  description?: string;
  detail?: string;
  images?: string[];
  tags?: string[];
  providerCost?: number;
  productionCost?: number;
  earnPercentage?: number;
  finalPrice?: number;
  guestsCoverage?: number;
  multipleAllowed?: boolean;
  deliveryRequired?: boolean;
}