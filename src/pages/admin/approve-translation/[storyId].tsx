import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";
import { ServerApiClient } from "@/apis/ServerApiClient";
import { H as HNode } from "@highlight-run/node";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { DBStory } from "@/interfaces/database/DBStory";
import TranslateForm from "@/components/translate/TranslateForm";

const serverApiClient = new ServerApiClient();

function ApproveTranslationPage({
  story,
  fromLanguage,
  toLanguage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("ApproveTranslationPage");

  const unapprovedTranslation = story.translations.find(
    (translation) =>
      (translation.fromLanguage === fromLanguage &&
        translation.translationLanguage === toLanguage) ||
      !translation.isApproved
  );

  return (
    <Layout
      pageTitle={t("page_title", { protagonist: story.protagonist })}
      pageDescription={t("page_description")}
    >
      <Container>
        <div className="space-y-4">
          <h1 className="title-1">
            {t.rich("heading", {
              protagonist: story.protagonist,
              b: (value) => <b>{value}</b>,
            })}
          </h1>
          <TranslateForm
            story={story}
            mode="approve"
            unapprovedTranslation={unapprovedTranslation}
          />
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ params, resolvedUrl, query }) => {
  initHighlightNode();

  const storyResult = await serverApiClient.getStoryById(
    params?.storyId as string
  );

  if (storyResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: storyResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(storyResult.error), resolvedUrl }
    );
    return {
      notFound: true,
    };
  }

  return {
    props: {
      story: storyResult.value,
      fromLanguage: query.from as string,
      toLanguage: query.to as string,
    },
  };
}) satisfies GetServerSideProps<{
  story: DBStory;
  fromLanguage: string;
  toLanguage: string;
}>;

export default ApproveTranslationPage;
