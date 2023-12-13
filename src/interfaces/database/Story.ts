interface StoryTranslatedFields {
  protagonist: string;
  city: string;
  story: string;
  job?: string;
}

export type DBStory = {
  _id: string;
  protagonist: string;
  city: string;
  story: string;
  job?: string;
  avatar: string;
  images: string[];
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  translations: {
    [key: string]: {
      protagonist: string;
      city: string;
      story: string;
      job?: string;
    };
  };
};

export type RegisteringStory = Omit<
  DBStory,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "isApproved"
  | "isHighlighted"
  | "isDeleted"
>;
