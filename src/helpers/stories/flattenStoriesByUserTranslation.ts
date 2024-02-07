import { DBStory } from "@/interfaces/database/DBStory";

export default function flattenStoriesByUserTranslation(
  stories: DBStory[],
  author: string
): DBStory[] {
  const result: DBStory[] = [];

  for (const story of stories) {
    for (const translation of story.translations) {
      if (translation.author === author && !translation.isOriginal) {
        result.push({ ...story, translations: [translation] });
      }
    }
  }

  return result;
}
