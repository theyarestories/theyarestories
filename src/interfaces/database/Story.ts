import { DBImage } from "./DBImage";

interface StoryTranslatedFields {
  protagonist: string;
  city: string;
  story: string;
  job?: string;
}

export type DBStory = StoryTranslatedFields & {
  _id: string;
  avatar: DBImage;
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
  translations: {
    [key: string]: StoryTranslatedFields;
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
  | "avatar"
> & { avatar: DBImage | null };
