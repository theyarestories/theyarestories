import { DBStory } from "@/interfaces/database/DBStory";
import TranslationItem from "./TranslationItem";

type Props = {
  stories: DBStory[];
};

function TranslationsList({ stories }: Props) {
  return (
    <div className="stories-grid">
      {stories.map((story) => (
        <TranslationItem key={story._id} story={story} />
      ))}
    </div>
  );
}

export default TranslationsList;
