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
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { DBStory } from "@/interfaces/database/DBStory";
import StoriesList from "@/components/stories/StoriesList";
import { useState } from "react";
import { useUpdateEffect } from "react-use";
import Paginator from "@/components/pagination/Paginator";

const serverApiClient = new ServerApiClient();

function ProfilePage({
  user,
  storiesWithPagination: serverStoriesWithPagination,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("ProfilePage");

  const [storiesPage, setStoriesPage] = useState(1);
  const [storiesWithPagination, setStoriesWithPagination] = useState(
    serverStoriesWithPagination
  );

  const updateStoriesWithPage = async (page: number) => {
    const storiesResult = await serverApiClient.getStories({
      author: user._id,
      limit: storiesWithPagination.pagination.limit,
      page,
    });

    if (storiesResult.isOk() && storiesResult.value.data.length > 0) {
      setStoriesWithPagination(storiesResult.value);
    }
  };

  useUpdateEffect(() => {
    updateStoriesWithPage(storiesPage);
  }, [storiesPage]);

  return (
    <Layout
      pageTitle={t("page_title", { username: user.username })}
      pageDescription={t("page_description")}
    >
      <Container>
        <div className="flex flex-col gap-y-4">
          {/* User name */}
          <h2 className="text-3xl text-center font-bold capitalize text-gray-700">
            {user.username}
          </h2>

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
              className="p-4"
              style={{ marginTop: consts.avatarLgSizeInPx / 2 + "px" }}
            >
              {/* user written stories */}
              <section className="space-y-4">
                <h3 className="title-2">{t("your_stories")}</h3>

                <StoriesList stories={storiesWithPagination.data} />

                {storiesWithPagination.pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Paginator
                      pageCount={storiesWithPagination.pagination.totalPages}
                      page={storiesPage - 1}
                      onPageChange={(value) =>
                        setStoriesPage(value.selected + 1)
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

export const getServerSideProps = (async ({ params }) => {
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
    limit: 4,
  });
  if (storiesResult.isErr()) {
    HNode.consumeError({
      name: "Error",
      message: JSON.stringify(storiesResult.error),
    });
    throw new Error(storiesResult.error.errorMessage);
  }

  return {
    props: {
      user: userResult.value,
      storiesWithPagination: storiesResult.value,
    },
  };
}) satisfies GetServerSideProps<{
  user: DBUser;
  storiesWithPagination: ServerAdvancedResponse<DBStory[]>;
}>;

export default ProfilePage;
