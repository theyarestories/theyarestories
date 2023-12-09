import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";

export default function AddStoryPage() {
  const t = useTranslations("AddStoryPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={"page_description"}>
      <Container>
        <h1 className="title-1">{t("heading")}</h1>
      </Container>
    </Layout>
  );
}
