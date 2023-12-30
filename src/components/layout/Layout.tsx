import Head from "next/head";
import { ReactNode } from "react";
import Header from "../header/Header";
import BottomNavigation from "../bottom-navigation/BottomNavigation";

type Props = {
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
  withStickyFooter?: boolean;
  withHeader?: boolean;
};

function Layout({
  pageTitle,
  pageDescription,
  children,
  withStickyFooter = true,
  withHeader = true,
}: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} key="desc" />
      </Head>

      {withHeader && <Header />}

      <main>{children}</main>

      {withStickyFooter && (
        <div className="sm:hidden">
          <BottomNavigation />
        </div>
      )}
    </>
  );
}

export default Layout;
