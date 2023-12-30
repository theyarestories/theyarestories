import Container from "@/components/container/Container";
import StickyBar from "@/components/container/StickyBar";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/logo/Logo";
import SharePlatforms from "@/components/stories/SharePlatforms";
import consts from "@/config/consts";
import removeMarkdown from "@/helpers/string/removeMarkdown";
import sliceAtEndOfWord from "@/helpers/string/sliceAtEndOfWord";
import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";
import { InferGetServerSidePropsType } from "next";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getServerSideProps, serverApiClient, Markdown } from "./[storyId]";

export function StoryPage({
  story,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isRtl = useIsRtl();
  const t = useTranslations("StoryPage");

  // const { translatedStory, translationLanguage } = useTranslatedStory(story);
  const [translationLanguage, setTranslationLanguage] = useState(
    Object.keys(story.translations)[0]
  );

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
