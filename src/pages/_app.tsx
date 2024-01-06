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

export default function App({ Component, pageProps }: AppProps) {
  // content direction
  const isRtl = useIsRtl();

  // Translations
  const router = useRouter();
  const translations = require(`@/translations/${router.locale}.json`);

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
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
