import Image from "next/image";
import { DBStory } from "@/interfaces/database/Story";

type Props = {
  story: DBStory;
};

function StoryItem({ story }: Props) {
  return (
    <article>
      <div className="flex gap-2">
        {story.avatar && (
          <Image
            className="w-24 h-24 object-cover object-center"
            src={story.avatar}
            alt=""
            width={0}
            height={0}
            sizes="1000px"
          />
        )}
        <h3 suppressHydrationWarning className="font-semibold text-sm">
          {story.protagonist}
        </h3>
      </div>

      <p suppressHydrationWarning>{story.story}</p>
    </article>
  );
}

export default StoryItem;
