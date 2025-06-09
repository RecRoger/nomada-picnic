import { PicnicItem } from "@models/picnic.dto";

export interface BudgetBasics {
  event: string;
  date: Date | string;
  place: string;
  guestsAmount: number;
}

export interface BudgetProduction {
  tableAmount: number;
  archIndicator: boolean;
  bigTableIndicator: boolean;
  boardText: string;
}

export interface BudgetAdditionals {
  petalsIndicator: boolean;
  flowersAmount: number;
  photoAmount: number;
  lightsIndicators: boolean;
  photographerIndicator: boolean;
}

export interface BudgetFood {
  giftText: string;
  items: PicnicItem[];
}

export interface BudgetContact {
  name: string;
  email: string;
  phone: number;
}

export interface BudgetData {
  basics: BudgetBasics;
  production: BudgetProduction;
  additionals: BudgetAdditionals;
  food: BudgetFood;
  contact: BudgetContact;
}