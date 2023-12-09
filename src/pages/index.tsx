import { Inter } from "next/font/google";
import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Story } from "@/interfaces/database/Story";
import { ServerApiClient } from "@/apis/ServerApiClient";
import classNames from "@/helpers/style/classNames";
import StoriesList from "@/components/stories/StoriesList";
import Container from "@/components/container/Container";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  stories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("Index");

  return (
    <main
      className={classNames(
        "flex min-h-screen flex-col items-center justify-between",
        inter.className
      )}
    >
      <Container>
        <StoriesList stories={stories} />
      </Container>
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
