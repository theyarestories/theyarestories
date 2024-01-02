import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import Container from "@/components/container/Container";
import InputContainer from "@/components/input/InputContainer";
import Layout from "@/components/layout/Layout";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBUser } from "@/interfaces/database/DBUser";
import { SignInRequest } from "@/interfaces/server/SignInRequest";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import Cookies from "js-cookie";

type Props = {};

const serverApiClient = new ServerApiClient();

function SignInPage({}: Props) {
  const t = useTranslations("SignInPage");

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [credentials, setCredentials] = useState<SignInRequest>({
    email: "",
    password: "",
  });
  const [credentialsErrors, setCredentialsErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const validateFields = async (
    fields: SignInRequest
  ): Promise<Result<true, false>> => {
    // email
    let emailError = "";
    if (!fields.email) {
      emailError = t("email_required");
    }

    // password
    let passwordError = "";
    if (!fields.password) {
      passwordError = t("password_required");
    }

    const allErrors = {
      emailError,
      passwordError,
    };
    setCredentialsErrors((prevErrors) => ({ ...prevErrors, ...allErrors }));
    const isValid = !Object.values(allErrors).some(Boolean);

    if (isValid) return ok(true);
    else return err(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCredentials((prevFields) => ({
      ...prevFields,
      [event.target.name]: event.target.value,
    }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      credentials: SignInRequest
    ): Promise<Result<DBUser, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);

      // 1. validate fields
      const validationResult = await validateFields(credentials);
      if (validationResult.isErr()) {
        return err({ errorMessage: "Credentials are not valid" });
      }

      // 2. Sign in
      const signInResult = await serverApiClient.signIn(credentials);
      if (signInResult.isErr()) {
        throw new Error(signInResult.error.errorMessage);
      }

      // 3. Set auth cookie
      Cookies.set("token", signInResult.value.token, {
        expires: Number(process.env.NEXT_PUBLIC_JWT_EXPIRE),
      });

      setIsSubmittedOnce(false);

      return ok(signInResult.value.user);
    }
  );

  useEffect(
    function validateFieldsOnChange() {
      if (isSubmittedOnce) {
        validateFields(credentials);
      }
    },
    [isSubmittedOnce, credentials]
  );

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4">
          <h1 className="title-1">{t("heading")}</h1>

          <form
            noValidate
            className="space-y-4"
            onSubmit={(event) => handleSubmit(event, credentials)}
          >
            <InputContainer
              label={t("email")}
              required
              error={credentialsErrors.emailError}
            >
              <input
                className="w-full input"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
              />
            </InputContainer>

            <InputContainer
              label={t("password")}
              required
              error={credentialsErrors.passwordError}
            >
              <input
                className="w-full input"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
              />
            </InputContainer>

            <ThemeButton
              className="w-full py-2.5"
              type="submit"
              loading={handleSubmitState.loading}
              disabled={handleSubmitState.loading}
              successMessage={
                handleSubmitState.value && handleSubmitState.value.isOk()
                  ? t("sign_in_success")
                  : ""
              }
              errorMessage={
                handleSubmitState.error ? t("something_went_wrong") : ""
              }
            >
              {t("sign_in")}
            </ThemeButton>
          </form>
        </div>
      </Container>
    </Layout>
  );
}

export default SignInPage;
