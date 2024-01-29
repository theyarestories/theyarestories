import { DBStory } from "@/interfaces/database/DBStory";
import { EmojiType } from "@/interfaces/database/EmojiType";

export default function countEmojiType(
  story: DBStory,
  emojiType: EmojiType
): number {
  const result = story.emojis.reduce(
    (prev, curr) => (curr.emojiType === emojiType ? prev + 1 : prev),
    0
  );

  return result;
}
