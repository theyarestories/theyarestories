import { Inter } from "next/font/google";
import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Story } from "@/interfaces/database/Story";
import { ServerApiClient } from "@/apis/ServerApiClient";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  stories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("Index");

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {t("title")}
    </main>
  );
}

export const getServerSideProps = (async (context) => {
  const serverApiClient = new ServerApiClient();
  const storiesResult = await serverApiClient.getStories();
  if (storiesResult.isErr()) {
    return {
      props: { stories: [] },
    };
  }
  return { props: { stories: storiesResult.value } };
}) satisfies GetServerSideProps<{
  stories: Story[];
}>;
