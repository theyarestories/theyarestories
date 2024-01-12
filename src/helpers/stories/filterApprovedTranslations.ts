import { DBStory } from "@/interfaces/database/DBStory";

export default function filterApprovedTranslations(
  stories: DBStory[]
): DBStory[] {
  const filteredStories = stories.map((story) => ({
    ...story,
    translations: story.translations.filter(
      (translation) => translation.isApproved
    ),
  }));

  return filteredStories;
}
