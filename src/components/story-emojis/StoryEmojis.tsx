import { DBStory } from "@/interfaces/database/DBStory";
import { EmojiType } from "@/interfaces/database/EmojiType";
import { useEffect, useState } from "react";
import HeartSvg from "../svgs/HeartSvg";
import RoseSvg from "../svgs/RoseSvg";
import hasUserEmojiedStory from "@/helpers/stories/hasUserEmojiedStory";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import countEmojiType from "@/helpers/stories/countEmojiType";
import classNames from "@/helpers/style/classNames";
import { ServerApiClient } from "@/apis/ServerApiClient";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import useMixpanelId from "@/hooks/useMixpanelId";
import CandleSvg from "../svgs/CandleSvg";

const mixpanelApiClient = new MixpanelApiClient();
const serverApiClient = new ServerApiClient();

type Props = { story: DBStory };

function StoryEmojis({ story }: Props) {
  const userId = useMixpanelId();

  const [emojis, setEmojis] = useState([
    {
      type: EmojiType.heart,
      isActive: false,
      Icon: HeartSvg,
      count: countEmojiType(story, EmojiType.heart),
    },
    // {
    //   type: EmojiType.rose,
    //   isActive: false,
    //   Icon: RoseSvg,
    //   count: countEmojiType(story, EmojiType.rose),
    // },
    // {
    //   type: EmojiType.candle,
    //   isActive: false,
    //   Icon: CandleSvg,
    //   count: countEmojiType(story, EmojiType.candle),
    // },
  ]);

  const handleClick = (emojiType: EmojiType, prevIsActive: boolean) => {
    // 1. Send Mixpanel event
    if (!prevIsActive) {
      mixpanelApiClient.event(MixpanelEvent["Like Story"], {
        "Story ID": story._id,
        "Story Protagonist": story.protagonist,
        "Story Language": story.translationLanguage,
      });
    }

    // 2. Update state
    setEmojis((prevEmojis) => {
      const newEmojis = prevEmojis.map((prevEmoji) => {
        if (prevEmoji.type === emojiType) {
          return {
            ...prevEmoji,
            isActive: !prevEmoji.isActive,
            count: prevEmoji.isActive
              ? prevEmoji.count - 1
              : prevEmoji.count + 1,
          };
        }
        return prevEmoji;
      });
      return newEmojis;
    });

    // 3. Update story in the database
    serverApiClient.emojiStory(story._id, { userId, emojiType });
  };

  useEffect(() => {
    setEmojis((prev) => {
      const result = prev.map((emoji) => ({
        ...emoji,
        isActive: hasUserEmojiedStory(story, userId, emoji.type),
      }));

      return result;
    });
  }, [userId]);

  return (
    <ul className="flex gap-3">
      {emojis.map(({ type, Icon, isActive, count }) => (
        <li key={type}>
          <button
            className="items-center flex gap-0.5"
            type="button"
            onClick={() => handleClick(type, isActive)}
          >
            <Icon isActive={isActive} className="w-8" />
            <span
              className={classNames("text-sm", count <= 0 ? "opacity-0" : "")}
            >
              {count}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default StoryEmojis;
