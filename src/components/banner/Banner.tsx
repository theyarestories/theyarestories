import { useTranslations } from "next-intl";

type Props = {};

function Banner({}: Props) {
  const t = useTranslations("Banner");

  return (
    <p className="gap-1 font-display text-gray-600 sm:text-2xl text-xl flex flex-col p-4 sm:p-6">
      <span>{t("not_number")}</span>
      <span>{t("but_stories")}</span>
    </p>
  );
}

export default Banner;
