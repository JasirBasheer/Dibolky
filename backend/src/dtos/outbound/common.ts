export interface PaginatedResponse<T> {
  data: T[];
  totalCount?: number;
  page?: number;
  totalPages?: number
}

