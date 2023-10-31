import "@/styles/globals.css";
import { NextIntlProvider } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  // Translations
  const router = useRouter();
  const translations = require(`@/translations/${router.locale}.json`);

  return (
    <NextIntlProvider messages={translations}>
      <Component {...pageProps} />
    </NextIntlProvider>
  );
}
