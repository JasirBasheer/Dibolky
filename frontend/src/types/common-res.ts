export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalCount: number;
  totalPages: number;
}
