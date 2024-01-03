import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DBStory } from "@/interfaces/database/DBStory";
import { ServerApiClient } from "@/apis/ServerApiClient";
import StoriesList from "@/components/stories/StoriesList";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import sortStoriesByLanguage from "@/helpers/stories/sortStoriesByLanguage";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";

export default function Home({
  stories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("IndexPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <StoriesList stories={stories} />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req, locale }) => {
  const serverApiClient = new ServerApiClient();
  const storiesResult = await serverApiClient.getStories();
  if (storiesResult.isErr()) {
    return {
      props: { stories: [] },
    };
  }

  // sort stories by user's preferred language
  const homeLanguage = req.cookies.home_language;
  let stories = storiesResult.value;

  // 1. sort
  stories = sortStoriesByLanguage(stories, locale || "");
  stories = sortStoriesByLanguage(stories, homeLanguage || "");

  // 2. translate
  stories = stories.map((story) => {
    let translationLanguage = story.translationLanguage;
    if (homeLanguage && storyHasLanguage(story, homeLanguage)) {
      translationLanguage = homeLanguage;
    } else if (locale && storyHasLanguage(story, locale)) {
      translationLanguage = locale;
    }
    return getTranslatedStory(story, translationLanguage);
  });

  return { props: { stories } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
}>;
