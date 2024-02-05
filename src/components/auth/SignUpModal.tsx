import React from "react";
import ModalContainer from "../modal/ModalContainer";
import { useTranslations } from "next-intl";
import SignUpForm from "./SignUpForm";

type Props = {
  isOpen: boolean;
  close: () => void;
};

function SignUpModal({ isOpen, close }: Props) {
  const t = useTranslations("SignUpModal");

  return (
    <ModalContainer title={t("sign_up")} isOpen={isOpen} close={close}>
      <SignUpForm successCallback={close} />
    </ModalContainer>
  );
}

export default SignUpModal;
