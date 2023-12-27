import Head from "next/head";
import { ReactNode } from "react";
import Header from "../header/Header";

type Props = {
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
};

function Layout({ pageTitle, pageDescription, children }: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} key="desc" />
      </Head>

      <Header />

      <main>{children}</main>
    </>
  );
}

export default Layout;
