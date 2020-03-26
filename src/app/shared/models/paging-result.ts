export interface PagingResult<T> {
  results?: T[];
  currentPage: number;
  totalCount: number;
}
