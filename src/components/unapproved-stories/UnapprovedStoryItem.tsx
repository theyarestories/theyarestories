import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  story: DBStory;
};

function UnapprovedStoryItem({ story }: Props) {
  const t = useTranslations("UnapprovedStoryItem");
  const { translatedStory } = useTranslatedStory(story);

  return (
    <article className="flex flex-col gap-1 relative">
      <Link href={`/admin/approve-story/${translatedStory._id}`}>
        <CldImage
          className="object-cover rounded-sm w-full animate-pulse-bg"
          src={translatedStory.avatar.cloudinaryId}
          alt=""
          width={300}
          height={300}
          crop="fill"
          gravity="auto"
        />
      </Link>
      <h3 className="font-semibold text-sm">
        {translatedStory.protagonist}{" "}
        {Number.isInteger(translatedStory.age) ? (
          <span className="font-normal">{`(${translatedStory.age})`}</span>
        ) : (
          ""
        )}
      </h3>
      <Link
        href={`/admin/approve-story/${translatedStory._id}`}
        className="button button-primary mt-auto"
      >
        {t("review")}
      </Link>
    </article>
  );
}

export default UnapprovedStoryItem;
