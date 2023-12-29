import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import SharePlatforms from "@/components/stories/SharePlatforms";
import ShareStory from "@/components/stories/SharePlatforms";
import consts from "@/config/consts";
import getTranslatedData from "@/helpers/database/getTranslatedData";
import removeMarkdown from "@/helpers/string/removeMarkdown";
import sliceAtEndOfWord from "@/helpers/string/sliceAtEndOfWord";
import { DBStory } from "@/interfaces/database/Story";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

const serverApiClient = new ServerApiClient();

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton count={7} />,
  }
);

function StoryPage({ story }: InferGetStaticPropsType<typeof getStaticProps>) {
  const t = useTranslations("StoryPage");

  const translatedStory = getTranslatedData(story);

  return (
    <Layout
      pageTitle={translatedStory.protagonist}
      pageDescription={sliceAtEndOfWord(
        removeMarkdown(translatedStory.story),
        consts.metaDescriptionMaxLetters
      )}
    >
      <Container>
        <div className="space-y-4">
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

      <div style={{ paddingBottom: consts.headerHeightInRems + "rem" }}>
        <div className="fixed bottom-0 w-full bg-white">
          <Container className="!py-0">
            <div
              className="border-t grid grid-cols-2 w-full"
              style={{ height: consts.headerHeightInRems + "rem" }}
            >
              <SharePlatforms
                story={translatedStory}
                className="justify-center !gap-2 border-e"
              />
              <Link
                className="flex items-center gap-2 justify-center font-bold"
                href={`/translate/${story._id}`}
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
          </Container>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths = (async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const storyResult = await serverApiClient.getStoryById(
    params?.storyId as string
  );

  if (storyResult.isErr()) {
    return {
      notFound: true,
    };
  }

  return { props: { story: storyResult.value } };
}) satisfies GetStaticProps<{
  story: DBStory;
}>;

export default StoryPage;
