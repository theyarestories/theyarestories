import getLanguageByCode from "@/helpers/translations/getLanguageByCode";
import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  story: DBStory;
};

function UnapprovedTranslationItem({ story }: Props) {
  const t = useTranslations("UnapprovedTranslationItem");
  const { translatedStory } = useTranslatedStory(story);
  const unapprovedTranslation = translatedStory.translations.find(
    (translation) => !translation.isApproved
  );

  if (!unapprovedTranslation) {
    return <></>;
  }

  const fromLanguage = getLanguageByCode(
    unapprovedTranslation.fromLanguage
  )?.name;
  const toLanguage = getLanguageByCode(
    unapprovedTranslation.translationLanguage
  )?.name;

  return (
    <article className="flex flex-col gap-1 relative">
      <Link
        href={{
          pathname: `/admin/approve-translation/${translatedStory._id}`,
          query: {
            from: unapprovedTranslation.fromLanguage,
            to: unapprovedTranslation.translationLanguage,
          },
        }}
      >
        <CldImage
          className="object-cover rounded-sm w-full"
          src={translatedStory.avatar.cloudinaryId}
          alt=""
          width={300}
          height={300}
          crop="fill"
          gravity="auto"
        />
      </Link>
      <h3 className="font-semibold text-sm text-center">
        {translatedStory.protagonist}{" "}
        {translatedStory.age ? (
          <span className="font-normal">{`(${translatedStory.age})`}</span>
        ) : (
          ""
        )}
      </h3>
      <p className="text-gray-600 text-sm flex gap-1 justify-center">
        {fromLanguage}
        <ArrowRightIcon className="w-4" />
        {toLanguage}
      </p>
      <Link
        href={{
          pathname: `/admin/approve-translation/${translatedStory._id}`,
          query: {
            from: unapprovedTranslation.fromLanguage,
            to: unapprovedTranslation.translationLanguage,
          },
        }}
        className="button button-primary mt-auto"
      >
        {t("review")}
      </Link>
    </article>
  );
}

export default UnapprovedTranslationItem;
