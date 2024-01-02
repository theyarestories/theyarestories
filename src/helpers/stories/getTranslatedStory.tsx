import { DBStory } from "@/interfaces/database/DBStory";
import structuredClone from "@ungap/structured-clone";
import storyHasLanguage from "./storyHasLanguage";

export default function getTranslatedStory(
  story: DBStory,
  translationLanguage: string
): DBStory {
  let result = story;
  if (story.translations && storyHasLanguage(story, translationLanguage)) {
    const translatedFields = structuredClone(
      story.translations[translationLanguage]
    );

    result = {
      ...story,
      protagonist: translatedFields.protagonist,
      story: translatedFields.story,
      job: translatedFields.job,
    };
  }

  return result;
}
