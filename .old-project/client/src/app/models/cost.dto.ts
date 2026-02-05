import { CostsTypes } from "@enums/cost-types.enum";

export interface CostDto {
  _id?: string;
  name: string;
  type: CostsTypes
  description: string;
  images?: string[];
  providerCost?: number;
  productionCost?: number;
  earnPercentage?: number;
  finalPrice?: number;
  guestsCoverage?: number;
  multipleAllowed?: boolean;
  deliveryRequired?: boolean;
}