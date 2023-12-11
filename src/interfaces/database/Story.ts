export interface Story {
  _id: string;
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  dateOfBirth?: string;
  job?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RegisteringStory = Omit<
  Story,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "isApproved"
  | "isHighlighted"
  | "isDeleted"
>;
