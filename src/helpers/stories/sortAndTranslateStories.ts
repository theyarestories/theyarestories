import { DBStory } from "@/interfaces/database/DBStory";
import structuredClone from "@ungap/structured-clone";
import sortStoriesByLanguage from "./sortStoriesByLanguage";
import getTranslatedStory from "./getTranslatedStory";
import storyHasLanguage from "./storyHasLanguage";

export default function sortAndTranslateStories(
  stories: DBStory[],
  homeLanguage?: string,
  locale?: string
) {
  let result = structuredClone(stories);

  if (locale) {
    result = sortStoriesByLanguage(stories, locale);
  }
  if (homeLanguage) {
    result = sortStoriesByLanguage(stories, homeLanguage);
  }

  result = result.map((story) => {
    let translationLanguage = story.translationLanguage;
    if (homeLanguage && storyHasLanguage(story, homeLanguage)) {
      translationLanguage = homeLanguage;
    } else if (locale && storyHasLanguage(story, locale)) {
      translationLanguage = locale;
    }
    return getTranslatedStory(story, translationLanguage);
  });

  return result;
}
