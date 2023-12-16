import { Inter } from "next/font/google";
import Head from "next/head";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

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

      <main className={inter.className}>{children}</main>
    </>
  );
}

export default Layout;
