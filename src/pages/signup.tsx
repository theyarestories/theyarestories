import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import SignUpForm from "@/components/auth/SignUpForm";

type Props = {};

function SignUpPage({}: Props) {
  const router = useRouter();
  const t = useTranslations("SignUpPage");

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4 max-w-md border p-4 rounded-sm mx-auto">
          <h1 className="title-1">{t("heading")}</h1>

          <SignUpForm successCallback={() => router.push("/")} />
        </div>
      </Container>
    </Layout>
  );
}

export default SignUpPage;
