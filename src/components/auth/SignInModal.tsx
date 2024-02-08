import React from "react";
import ModalContainer from "../modal/ModalContainer";
import { useTranslations } from "next-intl";
import SignInForm from "./SignInForm";

type Props = {
  isOpen: boolean;
  close: () => void;
};

function SignInModal({ isOpen, close }: Props) {
  const t = useTranslations("SignInModal");

  return (
    <ModalContainer title={t("sign_in")} isOpen={isOpen} close={close}>
      <SignInForm successCallback={close} />
    </ModalContainer>
  );
}

export default SignInModal;
