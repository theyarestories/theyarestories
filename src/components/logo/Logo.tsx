import { useTranslations } from "next-intl";

type Props = {};

function Logo({}: Props) {
  const t = useTranslations("Logo");

  return <h1 className="font-bold">{t("logo")}</h1>;
}

export default Logo;
