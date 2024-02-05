import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import Container from "@/components/container/Container";
import InputContainer from "@/components/input/InputContainer";
import Layout from "@/components/layout/Layout";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBUser } from "@/interfaces/database/DBUser";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import Cookies from "js-cookie";
import { SignUpRequest } from "@/interfaces/server/SignUpRequest";
import consts from "@/config/consts";
import * as EmailValidator from "email-validator";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";

type Props = {
  successCallback?: Function;
};

const serverApiClient = new ServerApiClient();
const mixpanelApiClient = new MixpanelApiClient();

function SignUpForm({ successCallback = () => {} }: Props) {
  const t = useTranslations("SignUpForm");

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [credentials, setCredentials] = useState<SignUpRequest>({
    mixpanelId: mixpanelApiClient.getUserId(),
    username: "",
    email: "",
    password: "",
  });
  const [credentialsErrors, setCredentialsErrors] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
  });

  const validateFields = async (
    fields: SignUpRequest
  ): Promise<Result<true, false>> => {
    // username
    let usernameError = "";
    if (!fields.username) {
      usernameError = t("username_required");
    } else if (fields.username.length > consts.maxUsernameLetters) {
      usernameError = t("username_exceeds_max_letters", {
        max: consts.maxUsernameLetters,
      });
    }

    // email
    let emailError = "";
    if (!fields.email) {
      emailError = t("email_required");
    } else if (!EmailValidator.validate(fields.email)) {
      emailError = t("email_invalid");
    } else if ((await serverApiClient.getUserByEmail(fields.email)).isOk()) {
      emailError = t("duplicate_email");
    }

    // password
    let passwordError = "";
    if (!fields.password) {
      passwordError = t("password_required");
    }

    const allErrors = {
      usernameError,
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
      credentials: SignUpRequest
    ): Promise<Result<DBUser, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);

      // 1. validate fields
      const validationResult = await validateFields(credentials);
      if (validationResult.isErr()) {
        return err({ errorMessage: "Credentials are not valid" });
      }

      // 2. Sign up
      const SignUpResult = await serverApiClient.signUp(credentials);
      if (SignUpResult.isErr()) {
        throw new Error(SignUpResult.error.errorMessage);
      }

      // 3. Set auth cookie
      Cookies.set("token", SignUpResult.value.token, {
        expires: Number(process.env.NEXT_PUBLIC_JWT_EXPIRE),
      });

      // 4. set Mixpanel ID
      mixpanelApiClient.identify(SignUpResult.value.user._id);

      // 5. Send events
      mixpanelApiClient.event(MixpanelEvent["Sign up"], {
        username: credentials.username,
      });

      // 6. Success callback
      successCallback();

      return ok(SignUpResult.value.user);
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
      <p>
        {t.rich("earn_badges", {
          icon: () => <HeartIcon className="w-4 fill-red-400 inline" />,
        })}
      </p>

      <InputContainer
        label={t("username")}
        required
        error={credentialsErrors.usernameError}
      >
        <input
          className="w-full input"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
      </InputContainer>

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
            ? t("sign_up_success")
            : ""
        }
        errorMessage={handleSubmitState.error ? t("something_went_wrong") : ""}
      >
        {t("sign_up")}
      </ThemeButton>

      <p className="flex gap-x-1.5">
        <span>{t("already_member")}</span>
        <Link href="/signin" className="font-semibold text-green-700 underline">
          {t("sign_in")}
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
