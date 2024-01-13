import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import StickyBar from "@/components/container/StickyBar";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/logo/Logo";
import ThemeSelect from "@/components/select/ThemeSelect";
import SharePlatforms from "@/components/stories/SharePlatforms";
import allLanguages from "@/config/all-languages/allLanguages";
import consts from "@/config/consts";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import mapLanguageCodesToOptions from "@/helpers/stories/mapLanguageCodesToOptions";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import removeMarkdown from "@/helpers/string/removeMarkdown";
import sliceAtEndOfWord from "@/helpers/string/sliceAtEndOfWord";
import classNames from "@/helpers/style/classNames";
import mapLanguagesToOptions from "@/helpers/translations/mapLanguagesToOptions";
import useIsRtl from "@/hooks/useIsRtl";
import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CldImage, CldOgImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { H as HNode } from "@highlight-run/node";
import filterApprovedTranslations from "@/helpers/stories/filterApprovedTranslations";

const serverApiClient = new ServerApiClient();

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton count={7} />,
  }
);

const languagesOptions = mapLanguagesToOptions(allLanguages);

function StoryPage({
  story,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isRtl = useIsRtl();
  const t = useTranslations("StoryPage");

  const { translatedStory, translationLanguage, setTranslationLanguage } =
    useTranslatedStory(story);

  useEffect(() => {
    serverApiClient.incrementStoryViews(story._id);
  }, [story]);

  return (
    <Layout
      pageTitle={translatedStory.protagonist}
      pageDescription={sliceAtEndOfWord(
        removeMarkdown(translatedStory.story),
        consts.metaDescriptionMaxLetters
      )}
      withStickyFooter={false}
      withHeader={false}
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

      <StickyBar isStickyTop>
        <div className="flex h-full items-center justify-between">
          <Logo />

          <div className="flex items-center">
            <span className="text-gray-400">{t("language_label")}</span>
            <ThemeSelect
              className="max-w-[10rem]"
              panelClassName="!w-auto max-w-[15rem]"
              options={mapLanguageCodesToOptions(
                story.translations.map(
                  (translation) => translation.translationLanguage
                ),
                languagesOptions
              )}
              selected={
                languagesOptions.find(
                  (lang) => lang.code === translationLanguage
                ) || null
              }
              handleChange={(language) => setTranslationLanguage(language.code)}
              withBorder={false}
            />
          </div>
        </div>
      </StickyBar>

      <Container>
        <div className="flex flex-col gap-y-4 relative">
          {story.viewsCount > 0 && (
            <p
              className={classNames(
                "absolute text-gray-500 top-0 text-sm items-center gap-1 hidden lg:flex",
                isRtl ? "left-0" : "right-0"
              )}
            >
              {t("views_count", { count: story.viewsCount })}
            </p>
          )}

          <div className="flex gap-8 items-center">
            {/* Image */}
            <CldImage
              className="object-cover rounded-full w-36 h-36 sm:w-40 sm:h-40"
              src={translatedStory.avatar.cloudinaryId}
              alt=""
              width={200}
              height={200}
              crop="fill"
              gravity="auto"
              priority
            />

            {/* Protagonist info */}
            <div className="">
              <p className="font-bold text-lg mb-2">
                {translatedStory.protagonist}
              </p>
              {Number.isInteger(translatedStory.age) && (
                <p className="">
                  {t.rich("age_bold", {
                    age: translatedStory.age,
                    b: (value) => <b className="font-medium">{value}</b>,
                  })}
                </p>
              )}
              {translatedStory.job && (
                <p className="">
                  {t.rich("job_bold", {
                    job: translatedStory.job,
                    b: (value) => <b className="font-medium">{value}</b>,
                  })}
                </p>
              )}
              <p className="">
                {t.rich("city_bold", {
                  city: translatedStory.city,
                  b: (value) => <b className="font-medium">{value}</b>,
                })}
              </p>
            </div>
          </div>

          <hr />

          <Markdown className="leading-8" source={translatedStory.story} />
        </div>
      </Container>

      <StickyBar isStickyTop={false}>
        <div className="h-full grid grid-cols-2">
          <SharePlatforms
            story={translatedStory}
            className="justify-center !gap-2 border-e"
          />
          <Link
            className="flex items-center gap-2 justify-center font-bold text-sm sm:text-base"
            href={`/translate/${story._id}?lang=${translationLanguage}`}
          >
            <Image
              src={"/images/icons/translate.svg"}
              alt={""}
              width={40}
              height={40}
            />
            {t("translate")}
          </Link>
        </div>
      </StickyBar>
    </Layout>
  );
}

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

  // filter out unapproved translations
  let story = filterApprovedTranslations([storyResult.value])[0];

  // translate
  const homeLanguage = req.cookies.home_language;
  let translationLanguage = story.translationLanguage;
  if (homeLanguage && storyHasLanguage(story, homeLanguage)) {
    translationLanguage = homeLanguage;
  } else if (locale && storyHasLanguage(story, locale)) {
    translationLanguage = locale;
  }
  const translatedStory = getTranslatedStory(story, translationLanguage);

  return { props: { story: translatedStory } };
}) satisfies GetServerSideProps<{
  story: DBStory;
}>;

export default StoryPage;
