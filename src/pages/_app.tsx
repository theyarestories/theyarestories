import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "react-loading-skeleton/dist/skeleton.css";
import useIsRtl from "@/hooks/useIsRtl";
import "@/styles/globals.css";
import { NextIntlProvider } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import UserProvider from "@/contexts/UserContext";
import { HighlightInit } from "@highlight-run/next/client";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { highlightInitConfig } from "@/config/highlight-io/highlightInitConfig";
import { Open_Sans } from "next/font/google";
import classNames from "@/helpers/style/classNames";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  fallback: ["system-ui", "arial"],
});

export default function App({ Component, pageProps }: AppProps) {
  // content direction
  const isRtl = useIsRtl();

  // Translations
  const router = useRouter();
  const translations = require(`@/translations/${router.locale}.json`);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={classNames("font-sans", openSans.variable)}
    >
      <ErrorBoundary>
        <NextIntlProvider messages={translations}>
          <UserProvider>
            <NextNProgress options={{ showSpinner: false }} color="#22c55e" />
            {process.env.NEXT_PUBLIC_ENV === "production" && (
              <HighlightInit {...highlightInitConfig} />
            )}
            <Component {...pageProps} />
          </UserProvider>
        </NextIntlProvider>
      </ErrorBoundary>
    </div>
  );
}
