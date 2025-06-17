export interface PriceingTransportation {
  code?: string;
  name?: string;
  zone?: number;
  price?: number;
  extra?: boolean;
}

export interface PriceingListItem {
  code?: string;
  name?: string;
  price?: number;
  amount?: number;
}

export interface PriceingList {
  items?: PriceingListItem[];
  listPrice?: number;
}

export interface Priceings {
  transportation?: PriceingTransportation;
  production?: PriceingList;
  gifts?: PriceingList;
}