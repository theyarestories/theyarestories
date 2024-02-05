import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { ServerApiClient } from "@/apis/ServerApiClient";
import classNames from "@/helpers/style/classNames";
import getUrlOrigin from "@/helpers/url/getUrlOrigin";
import { DBStory, SharePlatform } from "@/interfaces/database/DBStory";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import {
  FacebookIcon,
  FacebookShareButton,
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
const mixpanelApiClient = new MixpanelApiClient();

function SharePlatforms({ story, className = "" }: Props) {
  const shareUrl = `${getUrlOrigin()}/stories/${story._id}`;

  const platforms = [
    {
      platform: SharePlatform.twitter,
      Button: TwitterShareButton,
      Icon: XIcon,
      title: story.story,
      hashtags: ["theyarestories"],
    },
    {
      platform: SharePlatform.facebook,
      Button: FacebookShareButton,
      Icon: FacebookIcon,
      title: story.story,
      hashtag: "theyarestories",
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
      {platforms.map(({ platform, Button, Icon, title, hashtag, hashtags }) => (
        <li key={platform} className="flex relative">
          <Button
            onClick={() => {
              serverApiClient.incrementStoryShares(story._id, platform);
              mixpanelApiClient.event(MixpanelEvent["Share Story"], {
                Platform: platform,
                "Story ID": story._id,
                "Story Protagonist": story.protagonist,
              });
            }}
            url={shareUrl}
            title={title}
            hashtag={hashtag}
            hashtags={hashtags}
          >
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
