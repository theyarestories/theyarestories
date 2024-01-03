export interface StoryFilters {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  isAscending?: boolean;
  isHighlighted?: boolean;
  tags?: string[];
  search?: string;
}
