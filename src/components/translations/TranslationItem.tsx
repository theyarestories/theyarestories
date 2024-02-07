import classNames from "@/helpers/style/classNames";
import getLanguageByCode from "@/helpers/translations/getLanguageByCode";
import useIsRtl from "@/hooks/useIsRtl";
import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  story: DBStory;
};

function TranslationItem({ story }: Props) {
  const t = useTranslations("TranslationItem");
  const { translatedStory } = useTranslatedStory(story);
  const isRtl = useIsRtl();

  const translation = story.translations[0];
  const fromLanguage = getLanguageByCode(translation.fromLanguage)?.name;
  const toLanguage = getLanguageByCode(translation.translationLanguage)?.name;

  const protagonistImage = (
    <CldImage
      className="object-cover rounded-sm w-full animate-pulse-bg"
      src={story.avatar.cloudinaryId}
      alt=""
      width={300}
      height={300}
      crop="fill"
      gravity="auto"
    />
  );

  return (
    <article className="flex flex-col gap-1 relative">
      {translation.isApproved ? (
        <Link
          href={{
            pathname: `/stories/${story._id}`,
            query: { lang: translation.translationLanguage },
          }}
        >
          {protagonistImage}
        </Link>
      ) : (
        <div className="relative">
          {protagonistImage}
          <span
            className={classNames(
              "rounded-full text-xs text-gray-700 gap-0.5 bg-white absolute p-1 bg-opacity-90 top-1 flex",
              isRtl ? "left-1" : "right-1"
            )}
          >
            {t("in_review")}
          </span>
        </div>
      )}

      <h3 className="font-semibold text-sm text-center">
        {translatedStory.protagonist}{" "}
        {Number.isInteger(translatedStory.age) ? (
          <span className="font-normal">{`(${translatedStory.age})`}</span>
        ) : (
          ""
        )}
      </h3>
      <p className="text-gray-600 text-sm flex gap-1 justify-center">
        {fromLanguage}
        {isRtl ? (
          <ArrowLeftIcon className="w-4" />
        ) : (
          <ArrowRightIcon className="w-4" />
        )}
        {toLanguage}
      </p>
    </article>
  );
}

export default TranslationItem;
