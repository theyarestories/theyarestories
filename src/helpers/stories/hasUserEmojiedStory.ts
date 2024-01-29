import { DBStory } from "@/interfaces/database/DBStory";
import { EmojiType } from "@/interfaces/database/EmojiType";

export default function hasUserEmojiedStory(
  story: DBStory,
  userId: string,
  emojiType: EmojiType
): boolean {
  const result = story.emojis.some(
    (emoji) => emoji.emojiType === emojiType && emoji.userId === userId
  );

  return result;
}
