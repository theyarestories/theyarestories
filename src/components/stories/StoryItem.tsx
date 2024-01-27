import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";
import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { EyeIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  story: DBStory;
};

function StoryItem({ story }: Props) {
  const t = useTranslations("StoryItem");
  const isRtl = useIsRtl();
  const { translatedStory } = useTranslatedStory(story);

  return (
    <article className="flex flex-col gap-1 relative">
      <Link className="relative" href={`/stories/${translatedStory._id}`}>
        <CldImage
          className="object-cover rounded-sm w-full animate-pulse-bg"
          src={translatedStory.avatar.cloudinaryId}
          alt=""
          width={300}
          height={300}
          crop="fill"
          gravity="auto"
        />
        {story.viewsCount > 0 && (
          <span
            className={classNames(
              "rounded-full text-xs text-gray-600 gap-0.5 bg-white absolute p-1 bg-opacity-70 top-1 flex",
              isRtl ? "left-1" : "right-1"
            )}
          >
            <EyeIcon className="w-4" />
            {/* views: */}
            {story.viewsCount}
          </span>
        )}
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
        href={`/stories/${translatedStory._id}`}
        className="button button-primary mt-auto !px-2"
      >
        {t("read_my_story")}
      </Link>
    </article>
  );
}

export default StoryItem;
