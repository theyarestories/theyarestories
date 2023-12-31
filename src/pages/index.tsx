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
  initHighlightNode();

  const serverApiClient = new ServerApiClient();
  const storiesResult = await serverApiClient.getStories({
    isHighlighted: true,
  });
  if (storiesResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: storiesResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(storiesResult.error) }
    );
    return {
      props: { stories: [] },
    };
  }

  // sort stories by user's preferred language
  const homeLanguage = req.cookies.home_language;
  const stories = sortAndTranslateStories(
    storiesResult.value.data,
    homeLanguage,
    locale
  );

  return { props: { stories } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
}>;
