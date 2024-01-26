import consts from "@/config/consts";
import classNames from "@/helpers/style/classNames";
import { DBStatistics } from "@/interfaces/database/DBStatistics";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

type Props = {
  statistics: DBStatistics;
};

function Statistics({ statistics }: Props) {
  const t = useTranslations("Statistics");

  const formattedStatistics = {
    day: Math.ceil(
      DateTime.now().diff(consts.genocideStartDate, ["days"]).toObject().days ||
        0
    ),
    stories: statistics.writeStoryCount,
    visits: statistics.visitCount,
  };

  return (
    <ul className="grid grid-cols-3 divide-x divide-gray-300">
      {Object.entries(formattedStatistics).map(([key, value]) => (
        <li
          key={key}
          className={classNames(
            "text-center",
            key === "day" ? "text-red-800" : ""
          )}
        >
          {t(key)}: {value}
        </li>
      ))}
    </ul>
  );
}

export default Statistics;
