import { GetServerSideProps } from "next";
import { H as HNode } from "@highlight-run/node";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { serverApiClient } from "./[storyId]";

export const getServerSideProps = (async ({
  params,
  req,
  locale,
  resolvedUrl,
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

  // translate
  const homeLanguage = req.cookies.home_language;
  let translationLanguage = storyResult.value.translationLanguage;
  if (homeLanguage && storyHasLanguage(storyResult.value, homeLanguage)) {
    translationLanguage = homeLanguage;
  } else if (locale && storyHasLanguage(storyResult.value, locale)) {
    translationLanguage = locale;
  }
  const translatedStory = getTranslatedStory(
    storyResult.value,
    translationLanguage
  );

  return { props: { story: translatedStory } };
}) satisfies GetServerSideProps<{
  story: DBStory;
}>;
