import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DBStory } from "@/interfaces/database/DBStory";
import { ServerApiClient } from "@/apis/ServerApiClient";
import StoriesList from "@/components/stories/StoriesList";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import sortStoriesByLanguage from "@/helpers/stories/sortStoriesByLanguage";

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

export const getServerSideProps = (async (context) => {
  const serverApiClient = new ServerApiClient();
  const storiesResult = await serverApiClient.getStories();
  if (storiesResult.isErr()) {
    return {
      props: { stories: [] },
    };
  }

  // sort stories by user's preferred language
  const homeLanguage = context.req.cookies.home_language;
  let stories = storiesResult.value.data;
  if (homeLanguage) {
    stories = sortStoriesByLanguage(stories, homeLanguage);
  }

  return { props: { stories } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
}>;
