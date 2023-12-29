import Link from "next/link";
import StickyBar from "../container/StickyBar";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

type Props = {};

function BottomNavigation({}: Props) {
  const t = useTranslations("BottomNavigation");

  return (
    <StickyBar isStickyTop={false}>
      <nav className="h-full flex" aria-label="secondary">
        <ul className="grid grid-cols-2 w-full">
          <li className="border-e flex">
            <Link
              className="text-sm font-semibold py-1.5 px-4 flex justify-center items-center w-full"
              href={"/all-stories"}
            >
              {t("all_stories")}
            </Link>
          </li>
          <li className="flex">
            <Link
              className="text-sm font-semibold py-1.5 px-4 flex w-full justify-center items-center gap-1"
              href={"/add-story"}
            >
              <PencilSquareIcon className="w-6" />
              {t("add_story")}
            </Link>
          </li>
        </ul>
      </nav>
    </StickyBar>
  );
}

export default BottomNavigation;
