import Cookies from "js-cookie";

type DataWithTranslations<T> = T & {
  translations: {
    [key: string]: any;
  };
};

export default function getTranslatedData<T>(
  data: DataWithTranslations<T>,
  selectedLanguage?: string
): T {
  let translationLanguage = Cookies.get("home_language");
  if (selectedLanguage) translationLanguage = selectedLanguage;

  let result = data;
  if (
    translationLanguage &&
    Object.keys(data.translations).includes(translationLanguage)
  ) {
    result = {
      ...data,
      ...data.translations[translationLanguage],
    };
  }

  return result;
}
