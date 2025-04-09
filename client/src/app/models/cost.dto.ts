import { COSTS_TYPES } from "@enums/cost-types.enum";

export interface CostDto {
  _id?: string;
  name: string;
  type: COSTS_TYPES
  description: string;
  images?: string[];
  providerCost?: number;
  productionCost?: number;
  earnPercentage?: number;
  finalPrice?: number;
  guestsCoverage?: number;
}