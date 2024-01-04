import { DBStory } from "@/interfaces/database/DBStory";
import storyHasLanguage from "./storyHasLanguage";

export default function getTranslatedStory(
  story: DBStory,
  translationLanguage: string
): DBStory {
  let result = story;
  if (story.translations && storyHasLanguage(story, translationLanguage)) {
    const translatedFields = story.translations.find(
      (translation) => translation.translationLanguage === translationLanguage
    );

    if (translatedFields) {
      result = {
        ...story,
        translationLanguage: translatedFields.translationLanguage,
        protagonist: translatedFields.protagonist,
        story: translatedFields.story,
        job: translatedFields.job,
      };
    }
  }

  return result;
}
