export interface ServerAdvancedResponse<Data> {
  success: boolean;
  count: number;
  pagination: {
    [key: string]: {
      page: number;
      limit: number;
    };
  };
  data: Data;
}
