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
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const { user, isUserLoading } = useContext(UserContext) as UserContextType;
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const t = useTranslations("Header");
  const router = useRouter();

  const isAuthPage = ["signin", "signup"].some((page) =>
    router.pathname.includes(page)
  );

  let authButton = <></>;
  if (!isUserLoading && !isAuthPage) {
    if (user) {
      const avatar = user.avatar ? (
        <Image
          className="uppercase rounded-full border-green-600 border"
          src={user.avatar}
          alt=""
          width={28}
          height={28}
        />
      ) : (
        <span className="uppercase w-7 h-7 p-1 flex justify-center items-center rounded-full font-sans border-green-400 text-gray-600 bg-red-50 border">
          {user.username[0]}
        </span>
      );
      authButton = (
        <Link href={`/${user.username}`} aria-label={t("profile")}>
          {avatar}
        </Link>
      );
    } else {
      authButton = (
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
      );
    }
  }

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

        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <LanguageSwitch />

          {authButton}
        </div>
      </nav>
    </StickyBar>
  );
}

export default Header;
