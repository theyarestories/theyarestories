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
  age: number;
  createdAt: string;
  updatedAt: string;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};

export type RegisteringStory = StoryTranslatedFields & {
  avatar: DBImage | null;
  age: number | null;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};
