export interface ServerAdvancedResponse<Data> {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  pagination: {
    [key: string]: {
      page: number;
      limit: number;
    };
  };
  data: Data;
}
