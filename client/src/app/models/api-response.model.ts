export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  metadata?: {
    totalCount?: number;
    pageSize?: number;
    currentPage?: number;
    totalPages?: number;
  };
}
