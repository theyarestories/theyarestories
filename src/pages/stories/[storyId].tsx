import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import StickyBar from "@/components/container/StickyBar";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/logo/Logo";
import ThemeSelect from "@/components/select/ThemeSelect";
import SharePlatforms from "@/components/stories/SharePlatforms";
import allLanguages from "@/config/all-languages/allLanguages";
import consts from "@/config/consts";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import mapLanguageCodesToOptions from "@/helpers/stories/mapLanguageCodesToOptions";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import removeMarkdown from "@/helpers/string/removeMarkdown";
import sliceAtEndOfWord from "@/helpers/string/sliceAtEndOfWord";
import classNames from "@/helpers/style/classNames";
import getHomeLanguage from "@/helpers/translations/getHomeLanguage";
import mapLanguagesToOptions from "@/helpers/translations/mapLanguagesToOptions";
import useIsRtl from "@/hooks/useIsRtl";
import { DBStory } from "@/interfaces/database/DBStory";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

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
  const router = useRouter();
  const t = useTranslations("StoryPage");

  const [translationLanguage, setTranslationLanguage] = useState(
    Object.keys(story.translations)[0]
  );
  const translatedStory = getTranslatedStory(story, translationLanguage);

  useEffect(() => {
    const homeLanguage = getHomeLanguage();
    if (homeLanguage && storyHasLanguage(story, homeLanguage)) {
      return setTranslationLanguage(homeLanguage);
    }
    if (router.locale && storyHasLanguage(story, router.locale)) {
      return setTranslationLanguage(router.locale);
    }
  }, [router.locale]);

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
      <StickyBar isStickyTop>
        <div className="flex h-full items-center justify-between">
          <Logo />

          <div className="flex items-center">
            <span className="text-gray-400">{t("language_label")}</span>
            <ThemeSelect
              className="max-w-[10rem]"
              panelClassName="!w-auto max-w-[15rem]"
              options={mapLanguageCodesToOptions(
                Object.keys(story.translations),
                languagesOptions
              )}
              selected={
                languagesOptions.find(
                  (lang) => lang.code === translationLanguage
                ) || null
              }
              handleChange={(language) => setTranslationLanguage(language.code)}
              withOptionTick={false}
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
              className="object-cover rounded-full"
              src={translatedStory.avatar.url}
              alt=""
              width={150}
              height={150}
              crop="fill"
              gravity="auto"
            />

            {/* Protagonist info */}
            <div className="">
              <p className="font-bold text-lg mb-2">
                {translatedStory.protagonist}
              </p>
              {translatedStory.age && (
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

export const getServerSideProps = (async ({ params }) => {
  const storyResult = await serverApiClient.getStoryById(
    params?.storyId as string
  );

  if (storyResult.isErr()) {
    return {
      notFound: true,
    };
  }

  return { props: { story: storyResult.value } };
}) satisfies GetServerSideProps<{
  story: DBStory;
}>;

export default StoryPage;
