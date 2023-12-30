import { DBImage } from "./DBImage";

export enum SharePlatform {
  twitter = "twitter",
  whatsapp = "whatsapp",
  telegram = "telegram",
}

export interface StoryTranslatedFields {
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
  age: number | null;
  createdAt: string;
  updatedAt: string;
  shares: {
    [key in SharePlatform]?: number;
  };
  tags: string[];
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};

export type RegisteringStory = StoryTranslatedFields & {
  avatar?: DBImage;
  age?: number;
  tags?: string[];
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};
