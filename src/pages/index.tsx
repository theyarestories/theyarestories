import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DBStory } from "@/interfaces/database/DBStory";
import { ServerApiClient } from "@/apis/ServerApiClient";
import StoriesList from "@/components/stories/StoriesList";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import sortAndTranslateStories from "@/helpers/stories/sortAndTranslateStories";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { H as HNode } from "@highlight-run/node";
import filterApprovedTranslations from "@/helpers/stories/filterApprovedTranslations";
import Banner from "@/components/banner/Banner";

export default function Home({
  stories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("IndexPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <Banner />
        <StoriesList stories={stories} />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req, locale, resolvedUrl }) => {
  initHighlightNode();

  const serverApiClient = new ServerApiClient();
  const storiesResult = await serverApiClient.getStories({
    isHighlighted: true,
    isApproved: true,
    limit: 8,
  });
  if (storiesResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: storiesResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(storiesResult.error), resolvedUrl }
    );
    return {
      props: { stories: [] },
    };
  }

  // filter out unapproved translations
  let stories = filterApprovedTranslations(storiesResult.value.data);

  // sort stories by user's preferred language
  const homeLanguage = req.cookies.home_language;
  stories = sortAndTranslateStories(stories, homeLanguage, locale);

  return { props: { stories } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
}>;
