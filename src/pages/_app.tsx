import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import useIsRtl from "@/hooks/useIsRtl";
import "@/styles/globals.css";
import { NextIntlProvider } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  // content direction
  const isRtl = useIsRtl();

  // Translations
  const router = useRouter();
  const translations = require(`@/translations/${router.locale}.json`);

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <NextIntlProvider messages={translations}>
        <Component {...pageProps} />
      </NextIntlProvider>
    </div>
  );
}
