import { Story } from "@/interfaces/database/Story";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  stories: Story[];
};

function StoriesList({ stories }: Props) {
  const t = useTranslations("StoriesList");

  return (
    <section className="space-y-4">
      <h2 className="font-bold">{t("stories")}</h2>

      <div className="grid grid-cols-3 gap-4">
        {stories.map((story) => (
          <article key={story._id}>
            <div className="flex gap-2">
              <Image
                className="w-24 h-24 object-cover object-center"
                src={story.avatar}
                alt=""
                width={0}
                height={0}
                sizes="1000px"
              />
              <h3 className="font-semibold text-sm">{story.protagonist}</h3>
            </div>

            <p>{story.story}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StoriesList;
