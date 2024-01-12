import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { useTranslations } from "next-intl";
import { H as HNode } from "@highlight-run/node";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { DBStory } from "@/interfaces/database/DBStory";
import UnapprovedStoriesList from "@/components/unapproved-stories/UnapprovedStoriesList";

const serverApiClient = new ServerApiClient();

function AdminHomePage({
  unapprovedStories,
  unapprovedTranslations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("AdminPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <section className="space-y-4">
          <h2 className="title-1">{t("approve_stories")}</h2>
          <UnapprovedStoriesList storiesWithPagination={unapprovedStories} />

          <hr />

          <h2 className="title-1">{t("approve_translations")}</h2>
          <UnapprovedStoriesList storiesWithPagination={unapprovedStories} />
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ resolvedUrl }) => {
  initHighlightNode();

  // 1. unapproved stories
  const unapprovedStories = await serverApiClient.getStories({
    isApproved: false,
    limit: 4,
  });

  if (unapprovedStories.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: unapprovedStories.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(unapprovedStories.error), resolvedUrl }
    );
    throw new Error(unapprovedStories.error.errorMessage);
  }

  // 2. unapproved translations
  const unapprovedTranslations = await serverApiClient.getStories({
    isTranslationApproved: false,
    limit: 4,
  });

  if (unapprovedTranslations.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: unapprovedTranslations.error.errorMessage || "",
      },
      undefined,
      undefined,
      {
        payload: JSON.stringify(unapprovedTranslations.error),
        resolvedUrl,
      }
    );
    throw new Error(unapprovedTranslations.error.errorMessage);
  }

  return {
    props: {
      unapprovedStories: unapprovedStories.value,
      unapprovedTranslations: unapprovedTranslations.value,
    },
  };
}) satisfies GetServerSideProps<{
  unapprovedStories: ServerAdvancedResponse<DBStory[]>;
  unapprovedTranslations: ServerAdvancedResponse<DBStory[]>;
}>;

export default AdminHomePage;
