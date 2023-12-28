import { ServerApiClient } from "@/apis/ServerApiClient";
import consts from "@/config/consts";
import threeDots from "@/helpers/string/threeDots";
import getUrlOrigin from "@/helpers/url/getUrlOrigin";
import { DBStory, SharePlatform } from "@/interfaces/database/Story";
import { useTranslations } from "next-intl";
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
};

const serverApiClient = new ServerApiClient();

function ShareStory({ story }: Props) {
  const t = useTranslations("ShareStory");
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
    <div className="space-y-2">
      <p className="text-sm">{t("share")}</p>

      <div className="flex gap-1">
        {platforms.map(({ platform, Button, Icon, title }) => (
          <div className="flex flex-col items-center relative">
            <div
              className="flex"
              onClick={() =>
                serverApiClient.incrementStoryShares(story._id, platform)
              }
            >
              <Button url={shareUrl} title={title} className="">
                <Icon size={32} round />
              </Button>
              {typeof story.shares[platform] === "number" && (
                <span className="absolute top-0 right-0 flex bg-white w-4 h-4 justify-center items-center rounded-full text-sm border translate-x-1.5 -translate-y-1.5 cursor-default font-medium">
                  {story.shares[platform]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShareStory;
