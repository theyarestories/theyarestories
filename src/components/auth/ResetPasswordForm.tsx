import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import InputContainer from "@/components/input/InputContainer";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBUser } from "@/interfaces/database/DBUser";
import Cookies from "js-cookie";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import {
  ChangeEventHandler,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { UserContext, UserContextType } from "@/contexts/UserContext";

interface FormFields {
  mixpanelId: string;
  password: string;
  confirmPassword: string;
}

type Props = {};

const serverApiClient = new ServerApiClient();
const mixpanelApiClient = new MixpanelApiClient();

function ResetPasswordForm({}: Props) {
  const router = useRouter();
  const { setUser } = useContext(UserContext) as UserContextType;
  const t = useTranslations("ResetPasswordForm");

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [credentials, setCredentials] = useState<FormFields>({
    mixpanelId: mixpanelApiClient.getUserId(),
    password: "",
    confirmPassword: "",
  });
  const [credentialsErrors, setCredentialsErrors] = useState({
    passwordError: "",
    confirmPasswordError: "",
  });

  const validateFormFields = async (
    fields: FormFields
  ): Promise<Result<true, false>> => {
    // password
    let passwordError = "";
    if (!fields.password) {
      passwordError = t("password_required");
    }

    // confirm password
    let confirmPasswordError = "";
    if (!fields.confirmPassword) {
      confirmPasswordError = t("confirm_password_required");
    }

    // match
    if (
      fields.password &&
      fields.confirmPassword &&
      fields.password !== fields.confirmPassword
    ) {
      confirmPasswordError = t("password_not_match");
    }

    const allErrors = { passwordError, confirmPasswordError };
    setCredentialsErrors((prevErrors) => ({ ...prevErrors, ...allErrors }));
    const isValid = !Object.values(allErrors).some(Boolean);

    if (isValid) return ok(true);
    else return err(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCredentials((prevFormFields) => ({
      ...prevFormFields,
      [event.target.name]: event.target.value,
    }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      credentials: FormFields,
      resetToken: string
    ): Promise<Result<DBUser, ApiError>> => {
      event.preventDefault();
      setSubmitError("");
      setIsSubmittedOnce(true);

      // 1. validate fields
      const validationResult = await validateFormFields(credentials);
      if (validationResult.isErr()) {
        return err({ errorMessage: "Credentials are not valid" });
      }

      // 2. Send reset password request
      const resetPasswordResult = await serverApiClient.resetPassword(
        credentials,
        resetToken
      );
      if (resetPasswordResult.isErr()) {
        setSubmitError(t("something_went_wrong"));
        throw new Error(resetPasswordResult.error.errorMessage);
      }

      // 3. Set auth cookie
      Cookies.set("token", resetPasswordResult.value.token, {
        expires: Number(process.env.NEXT_PUBLIC_JWT_EXPIRE),
      });

      // 4. set Mixpanel ID
      mixpanelApiClient.identify(resetPasswordResult.value.user._id);

      setUser(resetPasswordResult.value.user);
      router.push("/");
      return ok(resetPasswordResult.value.user);
    }
  );

  useEffect(
    function validateFormFieldsOnChange() {
      if (isSubmittedOnce) {
        validateFormFields(credentials);
      }
    },
    [isSubmittedOnce, credentials]
  );
  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(event) =>
        handleSubmit(event, credentials, router.query.resetToken as string)
      }
    >
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

      <InputContainer
        label={t("confirm_password")}
        required
        error={credentialsErrors.confirmPasswordError}
      >
        <input
          className="w-full input"
          type="password"
          name="confirmPassword"
          value={credentials.confirmPassword}
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
            ? t("reset_password_success")
            : ""
        }
        errorMessage={submitError}
      >
        {t("reset_password")}
      </ThemeButton>
    </form>
  );
}

export default ResetPasswordForm;
