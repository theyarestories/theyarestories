import { DBEmoji } from "./DBEmoji";
import { DBImage } from "./DBImage";

export enum SharePlatform {
  twitter = "twitter",
  facebook = "facebook",
  whatsapp = "whatsapp",
}

export interface DBTranslation {
  _id: string;
  translationLanguage: string; // ar
  fromLanguage: string;
  protagonist: string;
  author: string;
  story: string;
  job?: string;
  isOriginal: boolean;
  isApproved: boolean;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DBStory = {
  _id: string;
  protagonist: string;
  author: string;
  protagonistTranslations: string[];
  story: string;
  job?: string;
  avatar: DBImage;
  city: string;
  age: number | null;
  shares: {
    [key in SharePlatform]?: number;
  };
  emojis: DBEmoji[];
  tags: string[];
  viewers: string[];
  translationLanguage: string; // ar
  translations: DBTranslation[];
  isApproved: boolean;
  approvedBy: string | null;
  isHighlighted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisteringTranslation = {
  translationLanguage: String; // ar
  fromLanguage: string;
  protagonist: string;
  author: string;
  isOriginal?: boolean;
  story: string;
  job?: string;
};

export type RegisteringStory = {
  protagonist: string;
  protagonistTranslations: string[];
  author: string;
  story: string;
  job?: string;
  city: string;
  avatar?: DBImage;
  age?: number;
  tags?: string[];
  translationLanguage: String; // ar
  translations: RegisteringTranslation[];
};
