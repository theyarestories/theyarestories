export interface StoryFilters {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  isTranslationApproved?: boolean;
  isAscending?: boolean;
  isHighlighted?: boolean;
  tags?: string[];
  search?: string;
}
