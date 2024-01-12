import { DBStory } from "@/interfaces/database/DBStory";
import StoryItem from "./StoryItem";

type Props = {
  stories: DBStory[];
};

function StoriesList({ stories }: Props) {
  return (
    <div className="stories-grid">
      {stories.map((story) => (
        <StoryItem key={story._id} story={story} />
      ))}
    </div>
  );
}

export default StoriesList;
