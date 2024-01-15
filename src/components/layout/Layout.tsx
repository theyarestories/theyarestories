import Head from "next/head";
import { ReactNode } from "react";
import Header from "../header/Header";
import BottomNavigation from "../bottom-navigation/BottomNavigation";
import Footer from "../footer/Footer";

type Props = {
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
  withStickyFooter?: boolean;
  withHeader?: boolean;
  withFooter?: boolean;
};

function Layout({
  pageTitle,
  pageDescription,
  children,
  withStickyFooter = true,
  withHeader = true,
  withFooter = true,
}: Props) {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} key="desc" />
      </Head>

      {withHeader && <Header />}

      <main>{children}</main>

      {withFooter && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}

      {withStickyFooter && (
        <div className="sm:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}

export default Layout;
