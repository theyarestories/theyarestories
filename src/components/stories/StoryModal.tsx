import { DBStory } from "@/interfaces/database/Story";
import ModalContainer from "../modal/ModalContainer";
import { Dispatch, SetStateAction } from "react";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import ShareStory from "./ShareStory";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-20 w-full bg-gray-300 animate-pulse" />,
  }
);

type Props = {
  story: DBStory;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function StoryModal({ story, isModalOpen, setIsModalOpen }: Props) {
  const t = useTranslations("StoryModal");

  return (
    <ModalContainer
      title={story.protagonist}
      isOpen={isModalOpen}
      close={() => setIsModalOpen(false)}
    >
      <div className="space-y-2">
        <div className="flex gap-8 items-center">
          {/* Image */}
          <CldImage
            className="object-cover rounded-full"
            src={story.avatar.url}
            alt=""
            width={120}
            height={120}
            crop="fill"
            gravity="auto"
          />

          {/* Protagonist info */}
          <div className="">
            {story.age && (
              <p className="">
                {t.rich("age_bold", {
                  age: story.age,
                  b: (value) => <b className="font-medium">{value}</b>,
                })}
              </p>
            )}
            {story.job && (
              <p className="">
                {t.rich("job_bold", {
                  job: story.job,
                  b: (value) => <b className="font-medium">{value}</b>,
                })}
              </p>
            )}
            <p className="">
              {t.rich("city_bold", {
                city: story.city,
                b: (value) => <b className="font-medium">{value}</b>,
              })}
            </p>
          </div>

          {/* Share */}
          <div className="flex-1 self-stretch justify-end flex items-start">
            <ShareStory story={story} />
          </div>
        </div>

        <hr />

        <div className="max-h-52 overflow-auto">
          <Markdown className="!font-serif" source={story.story} />
        </div>
      </div>
    </ModalContainer>
  );
}

export default StoryModal;
