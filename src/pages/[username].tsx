import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";
import { ServerApiClient } from "@/apis/ServerApiClient";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { H as HNode } from "@highlight-run/node";
import { DBUser } from "@/interfaces/database/DBUser";
import Container from "@/components/container/Container";
import Avatar from "@/components/avatar/Avatar";
import consts from "@/config/consts";
import { DBStory } from "@/interfaces/database/DBStory";
import StoriesList from "@/components/stories/StoriesList";
import { useContext, useState } from "react";
import Paginator from "@/components/pagination/Paginator";
import flattenStoriesByUserTranslation from "@/helpers/stories/flattenStoriesByUserTranslation";
import TranslationsList from "@/components/translations/TranslationsList";
import { useAsyncFn } from "react-use";
import Cookies from "js-cookie";
import { UserContext, UserContextType } from "@/contexts/UserContext";
import ThemeButton from "@/components/button/ThemeButton";
import useIsRtl from "@/hooks/useIsRtl";
import classNames from "@/helpers/style/classNames";
import { useRouter } from "next/router";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";

const serverApiClient = new ServerApiClient();
const mixpanelApiClient = new MixpanelApiClient();

function ProfilePage({
  user,
  userStories,
  storiesTranslatedByUser,
  isVisitorProfile: serverIsVisitorProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("ProfilePage");
  const router = useRouter();
  const isRtl = useIsRtl();
  const [isVisitorProfile, setIsVisitorProfile] = useState(
    serverIsVisitorProfile
  );
  const { setUser } = useContext(UserContext) as UserContextType;

  // stories
  const [storiesPage, setStoriesPage] = useState(0);
  const storiesStartIndex = storiesPage * consts.profileMaxStories;
  const storiesEndIndex = storiesStartIndex + consts.profileMaxStories;
  const storiesPageCount = Math.ceil(
    userStories.length / consts.profileMaxStories
  );

  // translations
  const [translationsPage, setTranslationsPage] = useState(0);
  const translationsStartIndex = translationsPage * consts.profileMaxStories;
  const translationsEndIndex =
    translationsStartIndex + consts.profileMaxStories;
  const translationsPageCount = Math.ceil(
    storiesTranslatedByUser.length / consts.profileMaxStories
  );

  // signout
  const [signoutState, signout] = useAsyncFn(async () => {
    await serverApiClient.signout();

    Cookies.remove("token");
    setIsVisitorProfile(false);
    setUser(null);
    mixpanelApiClient.reset();
    router.push("/");
  });

  return (
    <Layout
      pageTitle={t("page_title", { username: user.username })}
      pageDescription={t("page_description")}
    >
      <Container>
        <div className="flex flex-col gap-y-4">
          <div className="relative">
            {/* User name */}
            <h2 className="text-3xl text-center font-bold capitalize text-gray-700">
              {user.username}
            </h2>

            {/* Logout */}
            {isVisitorProfile && (
              <ThemeButton
                type="button"
                className={classNames(
                  "button-danger absolute top-0",
                  isRtl ? "left-0" : "right-0"
                )}
                onClick={signout}
                loading={signoutState.loading}
              >
                {t("logout")}
              </ThemeButton>
            )}
          </div>

          {/* Profile container */}
          <div
            className="border rounded-2xl relative"
            style={{ marginTop: consts.avatarLgSizeInPx / 2 + "px" }}
          >
            {/* avatar */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Avatar user={user} size="lg" />
            </div>

            {/* User interactions */}
            <div
              className="p-4 space-y-6"
              style={{ marginTop: consts.avatarLgSizeInPx / 2 + "px" }}
            >
              {/* user written stories */}
              <section className="space-y-4">
                <h3 className="title-2">
                  {isVisitorProfile
                    ? t("my_stories")
                    : t.rich("stories_by", {
                        username: user.username,
                        capitalize: (value) => (
                          <span className="capitalize">{value}</span>
                        ),
                      })}
                </h3>

                {userStories.length === 0 && isVisitorProfile && (
                  <p className="text-gray-500">{t("your_words")}</p>
                )}

                {userStories.length === 0 && !isVisitorProfile && (
                  <p className="text-gray-500">{t("no_stories")}</p>
                )}

                {userStories.length > 0 && (
                  <StoriesList
                    stories={userStories.slice(
                      storiesStartIndex,
                      storiesEndIndex
                    )}
                  />
                )}

                {userStories.length > consts.profileMaxStories && (
                  <div className="flex justify-center">
                    <Paginator
                      pageCount={storiesPageCount}
                      page={storiesPage}
                      onPageChange={(value) => setStoriesPage(value.selected)}
                    />
                  </div>
                )}
              </section>

              {/* user written translations */}
              <section className="space-y-4">
                <h3 className="title-2">
                  {isVisitorProfile
                    ? t("my_translations")
                    : t.rich("translations_by", {
                        username: user.username,
                        capitalize: (value) => (
                          <span className="capitalize">{value}</span>
                        ),
                      })}
                </h3>

                {storiesTranslatedByUser.length > 0 && (
                  <TranslationsList
                    stories={storiesTranslatedByUser.slice(
                      translationsStartIndex,
                      translationsEndIndex
                    )}
                  />
                )}

                {storiesTranslatedByUser.length === 0 && isVisitorProfile && (
                  <p className="text-gray-500">{t("bridge_cultures")}</p>
                )}

                {storiesTranslatedByUser.length === 0 && !isVisitorProfile && (
                  <p className="text-gray-500">{t("no_translations")}</p>
                )}

                {storiesTranslatedByUser.length > consts.profileMaxStories && (
                  <div className="flex justify-center">
                    <Paginator
                      pageCount={translationsPageCount}
                      page={translationsPage}
                      onPageChange={(value) =>
                        setTranslationsPage(value.selected)
                      }
                    />
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req, params }) => {
  initHighlightNode();

  if (!params || typeof params.username !== "string") {
    throw new Error("params.username doesn't exist");
  }

  // 1. Get user
  const userResult = await serverApiClient.getUserByUsername(params.username);

  if (userResult.isErr()) {
    HNode.consumeError({
      name: "Error",
      message: JSON.stringify(userResult.error),
    });
    throw new Error(userResult.error.errorMessage);
  }

  // 2. Get user's stories
  const storiesResult = await serverApiClient.getStories({
    author: userResult.value._id,
    limit: 0, // all
  });
  if (storiesResult.isErr()) {
    HNode.consumeError({
      name: "Error",
      message: JSON.stringify(storiesResult.error),
    });
    throw new Error(storiesResult.error.errorMessage);
  }

  // 3. Get user's translations
  const storiesTranslatedByUserResult = await serverApiClient.getStories({
    translationAuthor: userResult.value._id,
    limit: 0, // all
  });
  if (storiesTranslatedByUserResult.isErr()) {
    HNode.consumeError({
      name: "Error",
      message: JSON.stringify(storiesTranslatedByUserResult.error),
    });
    throw new Error(storiesTranslatedByUserResult.error.errorMessage);
  }
  const storiesTranslatedByUser = flattenStoriesByUserTranslation(
    storiesTranslatedByUserResult.value.data,
    userResult.value._id
  );

  // Check if visitor owns profile
  let isVisitorProfile = false;
  if (req.cookies.token) {
    const userByToken = await serverApiClient.getUserByToken(req.cookies.token);
    if (userByToken.isOk() && userByToken.value._id === userResult.value._id) {
      isVisitorProfile = true;
    }
  }

  return {
    props: {
      user: userResult.value,
      userStories: storiesResult.value.data,
      storiesTranslatedByUser,
      isVisitorProfile,
    },
  };
}) satisfies GetServerSideProps<{
  user: DBUser;
  userStories: DBStory[];
  storiesTranslatedByUser: DBStory[];
  isVisitorProfile: boolean;
}>;

export default ProfilePage;
