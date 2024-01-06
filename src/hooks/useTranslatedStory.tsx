import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import getHomeLanguage from "@/helpers/translations/getHomeLanguage";
import { DBStory } from "@/interfaces/database/DBStory";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useTranslatedStory(story: DBStory) {
  const router = useRouter();

  const [translationLanguage, setTranslationLanguage] = useState(
    story.translationLanguage
  );
  const translatedStory = getTranslatedStory(story, translationLanguage);

  useEffect(() => {
    const homeLanguage = getHomeLanguage();
    if (homeLanguage && storyHasLanguage(story, homeLanguage)) {
      return setTranslationLanguage(homeLanguage);
    }
    if (router.locale && storyHasLanguage(story, router.locale)) {
      return setTranslationLanguage(router.locale);
    }
  }, [router.locale]);

  return { translatedStory, translationLanguage, setTranslationLanguage };
}
