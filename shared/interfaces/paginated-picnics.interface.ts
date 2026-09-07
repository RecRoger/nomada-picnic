// interfaces/paginated-response.interface.ts
import { IPicnicDetail } from './picnic-detail.interface';

export interface IPaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

export interface IPaginatedPicnics {
  picnics: IPicnicDetail[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}