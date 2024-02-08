import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";

type Props = {};

function ResetPasswordPage({}: Props) {
  const t = useTranslations("ResetPasswordPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4 max-w-md border p-4 rounded-sm mx-auto">
          <h1 className="title-1">{t("heading")}</h1>

          <ResetPasswordForm />
        </div>
      </Container>
    </Layout>
  );
}

export default ResetPasswordPage;
