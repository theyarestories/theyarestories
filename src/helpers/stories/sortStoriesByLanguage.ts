import structuredClone from "@ungap/structured-clone";
import { DBStory } from "@/interfaces/database/DBStory";
import storyHasLanguage from "./storyHasLanguage";

export default function sortStoriesByLanguage(
  stories: DBStory[],
  language: string
): DBStory[] {
  const result = structuredClone(stories).sort((storyA, storyB) => {
    if (
      !storyHasLanguage(storyA, language) &&
      storyHasLanguage(storyB, language)
    ) {
      return 1;
    }
    if (
      storyHasLanguage(storyA, language) &&
      !storyHasLanguage(storyB, language)
    ) {
      return -1;
    }
    return 0;
  });

  return result;
}
