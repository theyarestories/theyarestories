import Link from "next/link";
import Logo from "../logo/Logo";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@heroicons/react/24/outline";
import LanguageSwitch from "./LanguageSwitch";
import StickyBar from "../container/StickyBar";

type Props = {};

function Header({}: Props) {
  const t = useTranslations("Header");

  return (
    <StickyBar isStickyTop>
      <nav
        className="flex items-center justify-between h-full"
        aria-label="main"
      >
        {/* Logo */}
        <Logo />

        {/* Main navigation links */}
        <ul className="sm:flex gap-2 items-center hidden">
          <li>
            <Link
              className="text-sm font-semibold py-1.5 px-4"
              href={"/all-stories"}
            >
              {t("all_stories")}
            </Link>
          </li>
          <li>
            <Link
              className="button button-primary flex gap-1"
              href={"/add-story"}
            >
              <PlusIcon className="w-5" />
              {t("add_story")}
            </Link>
          </li>
        </ul>

        {/* Language Switch */}
        <LanguageSwitch />
      </nav>
    </StickyBar>
  );
}

export default Header;
