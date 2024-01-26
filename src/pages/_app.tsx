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
import { highlightNextConfig } from "@/config/highlight-io/highlightNextConfig";
import { DM_Serif_Display, Open_Sans } from "next/font/google";
import classNames from "@/helpers/style/classNames";
import { useEffect } from "react";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import { ServerApiClient } from "@/apis/ServerApiClient";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  fallback: ["system-ui", "arial"],
});

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  fallback: ["system-ui", "arial"],
});

const mixpanelApiClient = new MixpanelApiClient();
const serverApiClient = new ServerApiClient();

export default function App({ Component, pageProps }: AppProps) {
  // content direction
  const isRtl = useIsRtl();

  // Translations
  const router = useRouter();
  const translations = require(`@/translations/${router.locale}.json`);

  useEffect(function sendVisitEvent() {
    mixpanelApiClient.event(MixpanelEvent.visit);
    serverApiClient.incrementStatisticsVisits();
  }, []);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={classNames("font-sans", openSans.variable, dmSerif.variable)}
    >
      <ErrorBoundary>
        <NextIntlProvider messages={translations}>
          <UserProvider>
            <NextNProgress options={{ showSpinner: false }} color="#22c55e" />
            <HighlightInit {...highlightNextConfig} />
            <Component {...pageProps} />
          </UserProvider>
        </NextIntlProvider>
      </ErrorBoundary>
    </div>
  );
}
