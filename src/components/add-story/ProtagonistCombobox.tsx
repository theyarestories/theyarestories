import { ServerApiClient } from "@/apis/ServerApiClient";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";
import { DBStory } from "@/interfaces/database/DBStory";
import { LanguageOption } from "@/interfaces/languages/LanguageOption";
import { Combobox, Transition } from "@headlessui/react";
import { ArrowUpLeftIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChangeEventHandler, Fragment, useState } from "react";

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  selectedLanguage: LanguageOption;
  name?: string;
};

const serverApiClient = new ServerApiClient();

function ProtagonistCombobox({
  value,
  onChange,
  selectedLanguage,
  name = "",
}: Props) {
  const isRtl = useIsRtl();
  const t = useTranslations("ProtagonistCombobox");

  const [suggestedStories, setSuggestedStories] = useState<DBStory[]>([]);

  const fetchSuggestions: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    let suggestedStories: DBStory[] = [];

    if (event.target.value.length > 0) {
      const suggestedStoriesResult = await serverApiClient.getStories({
        search: event.target.value,
      });

      if (
        suggestedStoriesResult.isOk() &&
        suggestedStoriesResult.value.data.length > 0
      ) {
        suggestedStories = suggestedStoriesResult.value.data.map((story) =>
          getTranslatedStory(story, selectedLanguage.code)
        );
      }
    }

    setSuggestedStories(suggestedStories);
  };

  return (
    <Combobox>
      <div className="relative">
        <Combobox.Input
          className="input w-full"
          value={value}
          displayValue={(_) => value}
          onChange={(event) => {
            onChange(event);
            fetchSuggestions(event);
          }}
          name={name}
        />
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
            {suggestedStories.map((story) => (
              <Combobox.Option
                className="flex"
                key={story._id}
                value={story._id}
              >
                {({ active }) => (
                  <Link
                    className={classNames(
                      "p-2 w-full",
                      active ? "bg-green-100" : ""
                    )}
                    href={`/stories/${story._id}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <figure className="flex items-center gap-4">
                      <CldImage
                        className="object-cover rounded-full"
                        src={story.avatar.cloudinaryId}
                        alt=""
                        width={60}
                        height={60}
                        crop="fill"
                        gravity="auto"
                      />

                      {/* Protagonist info */}
                      <figcaption className="text-sm">
                        {/* name */}
                        <p className="font-bold">{story.protagonist}</p>
                        {Number.isInteger(story.age) && (
                          <p className="">
                            {t.rich("age_bold", {
                              age: story.age,
                              b: (value) => (
                                <b className="font-medium">{value}</b>
                              ),
                            })}
                          </p>
                        )}
                        {story.job && (
                          <p className="">
                            {t.rich("job_bold", {
                              job: story.job,
                              b: (value) => (
                                <b className="font-medium">{value}</b>
                              ),
                            })}
                          </p>
                        )}
                      </figcaption>

                      {isRtl ? (
                        <ArrowUpLeftIcon className="w-6 h-6 p-1 border rounded-sm ms-auto" />
                      ) : (
                        <ArrowUpRightIcon className="w-6 h-6 p-1 border rounded-sm ms-auto" />
                      )}
                    </figure>
                  </Link>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

export default ProtagonistCombobox;
