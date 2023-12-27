import { DBStory } from "@/interfaces/database/Story";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

type Props = {
  story: DBStory;
};

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-20 bg-gray-300 animate-pulse" />,
  }
);

function StoryItem({ story }: Props) {
  const t = useTranslations("StoryItem");

  return (
    <article className="">
      <div className="flex gap-2 items-start">
        <CldImage
          className="object-cover rounded-sm"
          src={story.avatar.url}
          alt=""
          width={175}
          height={175}
          crop="fill"
          gravity="auto"
        />
        <div className="flex flex-col gap-1 self-stretch">
          <h3 className="font-semibold text-sm">{story.protagonist}</h3>
          <p className="text-sm text-gray-600">
            {t("age", { age: story.age })}
          </p>
          <hr className="my-1" />
          <Markdown
            className="truncatee !text-sm !font-serif"
            source={story.story}
          />
          <button className="button button-primary mt-auto">
            Read my story
          </button>
        </div>
      </div>
    </article>
  );
}

export default StoryItem;
