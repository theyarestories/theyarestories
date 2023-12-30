import structuredClone from "@ungap/structured-clone";
import { DBStory } from "@/interfaces/database/Story";
import { Locale } from "@/interfaces/languages/Locale";

export default function sortStoriesByLocale(
  stories: DBStory[],
  locale: Locale
): DBStory[] {
  const result = structuredClone(stories).sort((storyA, storyB) => {
    if (storyA.translations[locale] && storyB.translations[locale]) {
      return 0;
    }
    if (storyA.translations[locale] && !storyB.translations[locale]) {
      return -1;
    }
    return 1;
  });

  return result;
}
