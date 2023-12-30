import structuredClone from "@ungap/structured-clone";
import { DBStory } from "@/interfaces/database/DBStory";

export default function sortStoriesByLanguage(
  stories: DBStory[],
  language: string
): DBStory[] {
  const result = structuredClone(stories).sort((storyA, storyB) => {
    if (!storyA.translations[language] && storyB.translations[language]) {
      return 1;
    }
    if (storyA.translations[language] && !storyB.translations[language]) {
      return -1;
    }
    return 0;
  });

  return result;
}
