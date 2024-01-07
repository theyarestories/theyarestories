import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function Logo({}: Props) {
  const t = useTranslations("Logo");

  return (
    <Link href={"/"}>
      {/* <h1 className="font-bold">{t("logo")}</h1> */}
      <Image
        className="w-10"
        src={"/images/logo/logo.svg"}
        alt={t("logo")}
        width={0}
        height={0}
        priority
      />
    </Link>
  );
}

export default Logo;
