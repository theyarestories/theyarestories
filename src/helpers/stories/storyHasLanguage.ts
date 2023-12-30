import { DBStory } from "@/interfaces/database/DBStory";

export default function storyHasLanguage(
  story: DBStory,
  language: string
): boolean {
  const result = Object.keys(story.translations).includes(language);

  return result;
}
