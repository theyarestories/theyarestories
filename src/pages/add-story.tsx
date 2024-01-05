import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";
import StoryForm from "@/components/add-story/StoryForm";

export default function AddStoryPage() {
  const t = useTranslations("AddStoryPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4">
          <h1 className="title-1">{t("heading")}</h1>
          <StoryForm mode="add" />
        </div>
      </Container>
    </Layout>
  );
}
