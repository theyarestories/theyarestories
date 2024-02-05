import Link from "next/link";
import Logo from "../logo/Logo";
import { useTranslations } from "next-intl";
import { PlusIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import LanguageSwitch from "./LanguageSwitch";
import StickyBar from "../container/StickyBar";
import { useContext, useState } from "react";
import { UserContext, UserContextType } from "@/contexts/UserContext";
import SignUpModal from "../auth/SignUpModal";
import { useRouter } from "next/router";

type Props = {};

function Header({}: Props) {
  const { user } = useContext(UserContext) as UserContextType;
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const t = useTranslations("Header");
  const router = useRouter();

  const isAuthPage = ["signin", "signup"].some((page) =>
    router.pathname.includes(page)
  );

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
              className="button button-reverse flex gap-1"
              href={"/add-story"}
            >
              <PlusIcon className="w-5" />
              {t("add_story")}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <LanguageSwitch />

          {!isAuthPage && (
            <>
              {/* Sign up button */}
              <button
                type="button"
                onClick={() => setIsSignUpModalOpen(true)}
                aria-label={t("sign_up")}
              >
                <UserCircleIcon className="w-6 text-gray-600" />
              </button>

              {/* Sign up modal */}
              <SignUpModal
                isOpen={isSignUpModalOpen}
                close={() => setIsSignUpModalOpen(false)}
              />
            </>
          )}
        </div>
      </nav>
    </StickyBar>
  );
}

export default Header;
