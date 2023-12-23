import { ReactNode } from "react";
import ErrorMessage from "../alerts/ErrorMessage";
import { useTranslations } from "next-intl";

type Props = {
  children: ReactNode;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
};

function InputContainer({
  children,
  label,
  description,
  error,
  required = false,
}: Props) {
  const t = useTranslations("InputContainer");

  return (
    <div className="space-y-1">
      <label className="flex flex-col gap-0.5">
        <span className="text-sm">
          <span className="font-semibold">{label}</span>
          {!required && (
            <span className="text-gray-600"> ({t("not_required")})</span>
          )}
          {description && (
            <span className="text-gray-600"> ({description})</span>
          )}
          :
        </span>
        {children}
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default InputContainer;
