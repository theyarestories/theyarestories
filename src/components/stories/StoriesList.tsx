import { DBStory } from "@/interfaces/database/DBStory";
import { useTranslations } from "next-intl";
import StoryItem from "./StoryItem";

type Props = {
  stories: DBStory[];
};

function StoriesList({ stories }: Props) {
  const t = useTranslations("StoriesList");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10 gap-4">
      {stories.map((story) => (
        <StoryItem key={story._id} story={story} />
      ))}
    </div>
  );
}

export default StoriesList;
