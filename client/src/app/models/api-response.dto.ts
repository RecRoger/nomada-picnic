export interface ApiResponse<T> {
  status: string;
  message: string;
  errorCode: string;
  data: T | null;
}