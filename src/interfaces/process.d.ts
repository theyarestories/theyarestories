declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SERVER_URL: string;
    NEXT_PUBLIC_DETECT_LANGUAGE_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_API_KEY: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: string;
    NEXT_PUBLIC_ENV: "development" | "staging" | "production";
    NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: string;
  }
}
