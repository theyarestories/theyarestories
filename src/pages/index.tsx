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
import Link from "next/link";
import Statistics from "@/components/statistics/Statistics";
import { DBStatistics } from "@/interfaces/database/DBStatistics";

export default function Home({
  stories,
  statistics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("IndexPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container className="!pb-0">
        <div className="border divide-y">
          <Banner />
          <div className="bg-green-100 py-4 ">
            <Statistics statistics={statistics} />
          </div>
        </div>
      </Container>
      <Container>
        <div className="space-y-4">
          <StoriesList stories={stories} />
          <Link
            className="button button-reverse hidden sm:flex"
            href="/all-stories"
          >
            {t("all_stories")}
          </Link>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req, locale, resolvedUrl }) => {
  initHighlightNode();

  const serverApiClient = new ServerApiClient();

  // 1. Get statistics
  const statisticsResult = await serverApiClient.getStatistics();
  if (statisticsResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: statisticsResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(statisticsResult.error), resolvedUrl }
    );
    throw new Error(statisticsResult.error.errorMessage);
  }

  // 2. Get stories
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
    throw new Error(storiesResult.error.errorMessage);
  }

  // filter out unapproved translations
  let stories = filterApprovedTranslations(storiesResult.value.data);

  // sort stories by user's preferred language
  const homeLanguage = req.cookies.home_language;
  stories = sortAndTranslateStories(stories, homeLanguage, locale);

  return { props: { stories, statistics: statisticsResult.value } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
  statistics: DBStatistics;
}>;
