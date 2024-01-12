import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import removeMarkdown from "@/helpers/string/removeMarkdown";
import { DBStory } from "@/interfaces/database/DBStory";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CldOgImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import { H as HNode } from "@highlight-run/node";
import filterApprovedTranslations from "@/helpers/stories/filterApprovedTranslations";
import TranslateForm from "@/components/translate/TranslateForm";

const serverApiClient = new ServerApiClient();

function TranslateStoryPage({
  story,
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("TranslateStoryPage");

  const translatedStory = getTranslatedStory(story, locale);

  return (
    <Layout
      pageTitle={t("page_title", { protagonist: translatedStory.protagonist })}
      pageDescription={t("page_description", {
        protagonist: translatedStory.protagonist,
      })}
      withStickyFooter={false}
    >
      <CldOgImage
        src={translatedStory.avatar.cloudinaryId}
        alt={translatedStory.protagonist}
        width={2400}
        height={1200}
        crop="fill"
        gravity="auto"
        title={removeMarkdown(translatedStory.story)}
        twitterTitle={removeMarkdown(translatedStory.story)}
      />

      <Container>
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="title-1 !font-normal leading-6">
              {t.rich("heading", {
                protagonist: translatedStory.protagonist,
                b: (value) => <b className="font-semibold">{value}</b>,
              })}
            </h1>
            <p className="text-gray-600">{t("subheading")}</p>
          </div>

          <TranslateForm story={story} mode="add" />
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({
  params,
  query,
  resolvedUrl,
  locale,
}) => {
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

  // filter out unapproved translations
  let story = filterApprovedTranslations([storyResult.value])[0];

  // Translate
  const langParam = query.lang;
  if (typeof langParam === "string" && storyHasLanguage(story, langParam)) {
    story = getTranslatedStory(story, langParam);
  }

  return { props: { story, locale: locale || "en" } };
}) satisfies GetServerSideProps<{
  story: DBStory;
  locale: string;
}>;

export default TranslateStoryPage;
