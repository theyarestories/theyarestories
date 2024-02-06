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

const serverApiClient = new ServerApiClient();

function ProfilePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("ProfilePage");

  return (
    <Layout
      pageTitle={t("page_title", { username: user.username })}
      pageDescription={t("page_description")}
    >
      <Container>
        <div className="flex flex-col gap-y-4">
          {/* Name */}
          <h2 className="text-3xl text-center font-bold capitalize text-gray-700">
            {user.username}
          </h2>

          {/* Details */}
          <div
            className="border h-72 rounded-2xl bg-green-100 relative"
            style={{ marginTop: consts.avatarLgSizeInPx / 2 + "px" }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Avatar user={user} size="lg" />
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ resolvedUrl, params }) => {
  initHighlightNode();

  if (!params || typeof params.username !== "string") {
    throw new Error("params.username doesn't exist");
  }
  const userResult = await serverApiClient.getUserByUsername(params.username);

  if (userResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: userResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(userResult.error), resolvedUrl }
    );
    throw new Error(userResult.error.errorMessage);
  }

  return { props: { user: userResult.value } };
}) satisfies GetServerSideProps<{
  user: DBUser;
}>;

export default ProfilePage;
