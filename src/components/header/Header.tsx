import Link from "next/link";
import Container from "../container/Container";
import Logo from "../logo/Logo";
import { useTranslations } from "next-intl";
import consts from "@/config/consts";
import { PlusIcon } from "@heroicons/react/24/outline";
import ThemeSelect, { Option } from "../select/ThemeSelect";
import { SupportedLanguage } from "@/interfaces/languages/SupportedLanguage";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supportedLanguages } from "@/config/supported-languages/supportedLanguages";
import LanguageSwitch from "./LanguageSwitch";

type Props = {};

function Header({}: Props) {
  const t = useTranslations("Header");

  return (
    <header style={{ paddingTop: consts.headerHeightInRems + "rem" }}>
      <div className="fixed top-0 left-0 right-0 bg-white">
        <Container className="!py-0">
          <nav
            className="border-b flex items-center justify-between"
            style={{ height: consts.headerHeightInRems + "rem" }}
            aria-label="main"
          >
            {/* Logo */}
            <Logo />

            {/* Main navigation links */}
            <ul className="flex gap-2 items-center">
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
        </Container>
      </div>
    </header>
  );
}

export default Header;
