import { DBStory } from "@/interfaces/database/DBStory";

export default function storyHasLanguage(
  story: DBStory,
  language: string
): boolean {
  const result = story.translations.some(
    (translation) => translation.translationLanguage === language
  );

  return result;
}
