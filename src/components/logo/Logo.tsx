import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {};

function Logo({}: Props) {
  const t = useTranslations("Logo");

  return (
    <Link href={"/"}>
      <h1 className="font-bold">{t("logo")}</h1>
    </Link>
  );
}

export default Logo;
