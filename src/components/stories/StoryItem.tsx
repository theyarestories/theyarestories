import useTranslatedStory from "@/hooks/useTranslatedStory";
import { DBStory } from "@/interfaces/database/DBStory";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  story: DBStory;
};

function StoryItem({ story }: Props) {
  const t = useTranslations("StoryItem");
  const { translatedStory } = useTranslatedStory(story);

  return (
    <article className="flex flex-col gap-1 relative">
      <Link href={`/stories/${translatedStory._id}`}>
        <CldImage
          className="object-cover rounded-sm w-full"
          src={translatedStory.avatar.url}
          alt=""
          width={300}
          height={300}
          crop="fill"
          gravity="auto"
        />
      </Link>
      <h3 className="font-semibold text-sm">
        {translatedStory.protagonist}{" "}
        {translatedStory.age ? (
          <span className="font-normal">{`(${translatedStory.age})`}</span>
        ) : (
          ""
        )}
      </h3>
      <Link
        href={`/stories/${translatedStory._id}`}
        className="button button-primary mt-auto"
      >
        {t("read_my_story")}
      </Link>
    </article>
  );
}

export default StoryItem;
