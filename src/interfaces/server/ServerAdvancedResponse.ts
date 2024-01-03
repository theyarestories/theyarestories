export interface ServerAdvancedResponse<Data> {
  success: boolean;
  count: number;
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  data: Data;
}
