import consts from "@/config/consts";
import classNames from "@/helpers/style/classNames";
import { EventType } from "@/interfaces/database/DBEvent";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

type Props = {
  statistics: { [key in EventType]: number };
};

function Statistics({ statistics }: Props) {
  const t = useTranslations("Statistics");

  const formattedStatistics = {
    day: Math.ceil(
      DateTime.now().diff(consts.genocideStartDate, ["days"]).toObject().days ||
        0
    ),
    stories: statistics.write_story,
    visits: statistics.visit,
  };

  return (
    <ul className="grid grid-cols-3 divide-x divide-gray-300">
      {Object.entries(formattedStatistics).map(([key, value]) => (
        <li
          key={key}
          className={classNames(
            "text-center",
            key === "day" ? "text-wateremelon-800" : ""
          )}
        >
          {t(key)}: {value}
        </li>
      ))}
    </ul>
  );
}

export default Statistics;
