import { DBImage } from "./DBImage";

export enum SharePlatform {
  twitter = "twitter",
  facebook = "facebook",
  whatsapp = "whatsapp",
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
  shares: {
    [key in SharePlatform]?: number;
  };
  tags: string[];
  viewsCount: number;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
  createdAt: string;
  updatedAt: string;
};

export type RegisteringStory = StoryTranslatedFields & {
  avatar?: DBImage;
  age?: number;
  tags?: string[];
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};
