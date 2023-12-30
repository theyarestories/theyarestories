import { DBStory } from "@/interfaces/database/Story";
import { useTranslations } from "next-intl";
import StoryItem from "./StoryItem";
import getTranslatedData from "@/helpers/database/getTranslatedData";
import sortStoriesByLocale from "@/helpers/stories/sortStoriesByLocale";
import { useRouter } from "next/router";
import { Locale } from "@/interfaces/languages/Locale";

type Props = {
  stories: DBStory[];
};

function StoriesList({ stories }: Props) {
  const router = useRouter();
  const t = useTranslations("StoriesList");

  let sortedStories = stories;
  if (router.locale) {
    sortedStories = sortStoriesByLocale(stories, router.locale as Locale);
  }

  return (
    <section className="space-y-4">
      <h2 className="font-bold">{t("stories")}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10 gap-4">
        {sortedStories.map((story) => (
          <StoryItem key={story._id} story={getTranslatedData(story)} />
        ))}
      </div>
    </section>
  );
}

export default StoriesList;
