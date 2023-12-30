import { DBImage } from "./DBImage";

export enum SharePlatform {
  twitter = "twitter",
  facebook = "facebook",
  whatsapp = "whatsapp",
}

export interface DBTranslatedFields {
  protagonist: string;
  story: string;
  job?: string;
  isApproved: boolean;
}

export type DBStory = {
  _id: string;
  protagonist: string;
  story: string;
  job?: string;
  avatar: DBImage;
  city: string;
  age: number | null;
  shares: {
    [key in SharePlatform]?: number;
  };
  tags: string[];
  viewsCount: number;
  translations: {
    [key: string]: DBTranslatedFields;
  };
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisteringTranslatedFields = {
  protagonist: string;
  story: string;
  job?: string;
};

export type RegisteringStory = {
  protagonist: string;
  story: string;
  job?: string;
  city: string;
  avatar?: DBImage;
  age?: number;
  tags?: string[];
  translations: {
    [key: string]: RegisteringTranslatedFields;
  };
};
