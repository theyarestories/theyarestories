import { Inter } from "next/font/google";
import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DBStory } from "@/interfaces/database/Story";
import { ServerApiClient } from "@/apis/ServerApiClient";
import classNames from "@/helpers/style/classNames";
import StoriesList from "@/components/stories/StoriesList";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  stories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("IndexPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={"page_description"}>
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
  return { props: { stories: storiesResult.value } };
}) satisfies GetServerSideProps<{
  stories: DBStory[];
}>;
