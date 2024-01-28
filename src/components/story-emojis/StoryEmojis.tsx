import { DBStory } from "@/interfaces/database/DBStory";
import { EmojiType } from "@/interfaces/database/EmojiType";
import { useState } from "react";
import HeartSvg from "../svgs/HeartSvg";
import RoseSvg from "../svgs/RoseSvg";

type Props = { story: DBStory };

function StoryEmojis({ story }: Props) {
  const [emojis, setEmojis] = useState([
    { type: EmojiType.heart, isActive: false, Icon: HeartSvg },
    { type: EmojiType.rose, isActive: false, Icon: RoseSvg },
  ]);

  return <div>StoryInteractions</div>;
}

export default StoryEmojis;
