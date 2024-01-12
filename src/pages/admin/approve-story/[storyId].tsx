import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import StoryForm from "@/components/add-story/StoryForm";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";
import { ServerApiClient } from "@/apis/ServerApiClient";
import { H as HNode } from "@highlight-run/node";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { DBStory } from "@/interfaces/database/DBStory";

const serverApiClient = new ServerApiClient();

function ApproveStoryPage({
  story,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("ApproveStoryPage");

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
          <StoryForm mode="approve" unapprovedStory={story} />
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ params, resolvedUrl }) => {
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

  return { props: { story: storyResult.value } };
}) satisfies GetServerSideProps<{
  story: DBStory;
}>;

export default ApproveStoryPage;
