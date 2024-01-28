import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {};

function Banner({}: Props) {
  const t = useTranslations("Banner");
  const isRtl = useIsRtl();

  return (
    // text-gray-600
    // color: "#c47c68"
    <p className="gap-1 font-display sm:text-2xl text-xl flex flex-col p-4 sm:p-6 relative border-2 border-green-400 text-gray-600 bg-watermelon-50">
      {/* rotate-[250deg] */}
      <Image
        className={classNames(
          // "w-14 opacity-20 h-auto absolute top-0 -translate-y-1/3",
          // isRtl ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
          // "w-14 opacity-30 h-auto absolute top-3",
          // isRtl ? "left-3" : "right-3"
          // "w-14 opacity-30 h-auto absolute -top-6",
          // isRtl ? "-right-6" : "-left-6"
          // "w-14 opacity-30 h-auto absolute top-5",
          // isRtl ? "right-52" : "left-52 left-64 left-80"
          "w-12 opacity-40 h-auto absolute bottom-2",
          isRtl ? "left-4" : "right-4 -rotate-12"
        )}
        src="/images/icons/watermelon-3.svg"
        alt=""
        width={0}
        height={0}
      />
      <span>{t("not_number")}</span>
      <span>{t("but_stories")}</span>
    </p>
  );
}

export default Banner;
