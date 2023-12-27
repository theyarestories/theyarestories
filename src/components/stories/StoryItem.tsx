import { DBStory } from "@/interfaces/database/Story";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

type Props = {
  story: DBStory;
};

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

function StoryItem({ story }: Props) {
  const t = useTranslations("StoryItem");

  return (
    <article>
      <div className="flex gap-2 items-start">
        <CldImage
          className="object-cover rounded-sm"
          src={story.avatar.url}
          alt=""
          width={150}
          height={150}
          crop="fill"
          gravity="auto"
        />
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm">{story.protagonist}</h3>
          <p className="text-sm text-gray-600">
            {t("age", { age: story.age })}
          </p>
          <hr className="my-1" />
          <Markdown
            className="truncatee text-sm space-y-1 leading-5 font-serif"
            source={story.story}
          />
        </div>
      </div>

      {/* <p>{story.story}</p> */}
    </article>
  );
}

export default StoryItem;
