import { useEffect, useState } from "react";
import ThemeSelect, { Option } from "../select/ThemeSelect";
import { supportedLanguages } from "@/config/supported-languages/supportedLanguages";
import { SupportedLanguage } from "@/interfaces/languages/SupportedLanguage";
import { useRouter } from "next/router";

type Props = {};

function LanguageSwitch({}: Props) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    supportedLanguages[0]
  );

  useEffect(() => {
    if (router.locale) {
      const selectedLanguage =
        supportedLanguages.find((lang) => lang.locale === router.locale) ||
        supportedLanguages[0];
      setSelectedLanguage(selectedLanguage);
    }
  }, [router.locale]);

  const handleLanguageChange = (language: Option<SupportedLanguage>) => {
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: language.locale }
    );
  };

  return (
    <ThemeSelect<SupportedLanguage>
      withBorder={false}
      options={supportedLanguages}
      selected={selectedLanguage}
      handleChange={handleLanguageChange}
      className="max-w-[10rem]"
      withOptionTick={false}
    />
  );
}

export default LanguageSwitch;
