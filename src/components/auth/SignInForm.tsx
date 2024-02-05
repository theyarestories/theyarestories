import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import InputContainer from "@/components/input/InputContainer";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBUser } from "@/interfaces/database/DBUser";
import { SignInRequest } from "@/interfaces/server/SignInRequest";
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
import Cookies from "js-cookie";
import Link from "next/link";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { UserContext, UserContextType } from "@/contexts/UserContext";

type Props = {
  successCallback?: Function;
};

const serverApiClient = new ServerApiClient();
const mixpanelApiClient = new MixpanelApiClient();

function SignInForm({ successCallback = () => {} }: Props) {
  const t = useTranslations("SignInForm");
  const { setUser } = useContext(UserContext) as UserContextType;

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [credentials, setCredentials] = useState<SignInRequest>({
    mixpanelId: mixpanelApiClient.getUserId(),
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
      setUser(signInResult.value.user);

      // 3. Set auth cookie
      Cookies.set("token", signInResult.value.token, {
        expires: Number(process.env.NEXT_PUBLIC_JWT_EXPIRE),
      });

      // 4. set Mixpanel ID
      mixpanelApiClient.identify(signInResult.value.user._id);

      // 5. Success callback
      successCallback();

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
        className="w-full py-2"
        type="submit"
        loading={handleSubmitState.loading}
        disabled={handleSubmitState.loading}
        successMessage={
          handleSubmitState.value && handleSubmitState.value.isOk()
            ? t("sign_in_success")
            : ""
        }
        errorMessage={handleSubmitState.error ? t("something_went_wrong") : ""}
      >
        {t("sign_in")}
      </ThemeButton>

      <p className="flex gap-x-1.5">
        <span>{t("not_member")}</span>
        <Link href="/signup" className="font-semibold text-green-700 underline">
          {t("join")}
        </Link>
      </p>
    </form>
  );
}

export default SignInForm;
