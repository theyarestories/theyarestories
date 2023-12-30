import { ServerApiClient } from "@/apis/ServerApiClient";
import consts from "@/config/consts";
import threeDots from "@/helpers/string/threeDots";
import classNames from "@/helpers/style/classNames";
import getUrlOrigin from "@/helpers/url/getUrlOrigin";
import { DBStory, SharePlatform } from "@/interfaces/database/Story";
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

type Props = {
  story: DBStory;
  className?: string;
};

const serverApiClient = new ServerApiClient();

function SharePlatforms({ story, className = "" }: Props) {
  const shareUrl = `${getUrlOrigin()}/stories/${story._id}`;

  const platforms = [
    {
      platform: SharePlatform.twitter,
      Button: TwitterShareButton,
      Icon: XIcon,
      title: threeDots(story.story, consts.twitterMaxLetters),
    },
    {
      platform: SharePlatform.telegram,
      Button: TelegramShareButton,
      Icon: TelegramIcon,
      title: story.story,
    },
    {
      platform: SharePlatform.whatsapp,
      Button: WhatsappShareButton,
      Icon: WhatsappIcon,
      title: story.story,
    },
  ];

  return (
    <ul className={classNames("flex gap-1", className)}>
      {platforms.map(({ platform, Button, Icon, title }) => (
        <li
          key={platform}
          className="flex relative"
          onClick={() =>
            serverApiClient.incrementStoryShares(story._id, platform)
          }
        >
          <Button url={shareUrl} title={title} className="">
            <Icon size={40} round />
          </Button>
          {typeof story.shares[platform] === "number" && (
            <span className="absolute top-0 right-0 flex bg-white p-0.5 aspect-square h-5 justify-center items-center rounded-full text-sm border translate-x-1.5 -translate-y-0 cursor-default font-medium">
              {story.shares[platform]}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default SharePlatforms;
