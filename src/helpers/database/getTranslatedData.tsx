import getHomeLanguage from "../translations/getHomeLanguage";

type DataWithTranslations<T> = T & {
  translations: {
    [key: string]: any;
  };
};

export default function getTranslatedData<T>(
  data: DataWithTranslations<T>,
  selectedLanguage?: string
): T {
  let translationLanguage = getHomeLanguage();
  if (selectedLanguage) translationLanguage = selectedLanguage;

  let result = data;
  if (
    translationLanguage &&
    data.translations &&
    Object.keys(data.translations).includes(translationLanguage)
  ) {
    result = {
      ...data,
      ...data.translations[translationLanguage],
    };
  }

  return result;
}
