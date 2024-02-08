import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import InputContainer from "@/components/input/InputContainer";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBUser } from "@/interfaces/database/DBUser";
import { ForgotPasswordRequest } from "@/interfaces/server/ForgotPasswordRequest";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import useIsRtl from "@/hooks/useIsRtl";
type Props = {};

const serverApiClient = new ServerApiClient();

function ForgotPasswordForm({}: Props) {
  const router = useRouter();
  const isRtl = useIsRtl();
  const t = useTranslations("ForgotPasswordForm");

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [credentials, setCredentials] = useState<ForgotPasswordRequest>({
    email: "",
  });
  const [credentialsErrors, setCredentialsErrors] = useState({
    emailError: "",
  });

  const validateFields = async (
    fields: ForgotPasswordRequest
  ): Promise<Result<true, false>> => {
    // email
    let emailError = "";
    if (!fields.email) {
      emailError = t("email_required");
    } else if (!(await serverApiClient.getUserByEmail(fields.email)).isOk()) {
      emailError = t("email_not_exist");
    }

    const allErrors = { emailError };
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
      credentials: ForgotPasswordRequest
    ): Promise<Result<DBUser, ApiError>> => {
      event.preventDefault();
      setSubmitError("");
      setIsSubmittedOnce(true);

      // 1. validate fields
      const validationResult = await validateFields(credentials);
      if (validationResult.isErr()) {
        return err({ errorMessage: "Credentials are not valid" });
      }

      // 2. Send forgot password request
      const forgotPasswordResult = await serverApiClient.forgotPassword(
        credentials
      );
      if (forgotPasswordResult.isErr()) {
        setSubmitError(t("something_went_wrong"));
        throw new Error(forgotPasswordResult.error.errorMessage);
      }

      return ok(forgotPasswordResult.value.user);
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

      <ThemeButton
        className="w-full py-2 button-primary"
        type="submit"
        loading={handleSubmitState.loading}
        disabled={handleSubmitState.loading}
        successMessage={
          handleSubmitState.value && handleSubmitState.value.isOk()
            ? t("forgot_password_success")
            : ""
        }
        errorMessage={submitError}
      >
        {t("reset_password")}
      </ThemeButton>

      <Link
        href="/signin"
        className="font-semibold text-green-700 underline flex items-center gap-1"
      >
        {isRtl ? (
          <ArrowRightIcon className="w-4" />
        ) : (
          <ArrowLeftIcon className="w-4" />
        )}
        {t("back_to_login")}
      </Link>
    </form>
  );
}

export default ForgotPasswordForm;
