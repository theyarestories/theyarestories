"use-client";

import classNames from "@/helpers/style/classNames";
import { MouseEventHandler, ReactNode } from "react";
import ErrorMessage from "../alerts/ErrorMessage";
import SuccessMessage from "../alerts/SuccessMessage";
import Spinner from "../spinner/Spinner";

type Props = {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  errorMessage?: string;
  successMessage?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function ThemeButton({
  children,
  type,
  className = "",
  errorMessage,
  successMessage,
  loading = false,
  disabled = false,
  onClick = () => {},
}: Props) {
  return (
    <div className="space-y-1.5">
      <button
        className={classNames(
          "button button-primary gap-2",
          className,
          disabled ? "cursor-not-allowed opacity-50" : ""
        )}
        type={type}
        onClick={onClick}
      >
        {children}
        {loading && <Spinner className="!h-4 !w-4 fill-teal-600" />}
      </button>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  );
}

export default ThemeButton;
