import { LanguageDetails } from "@/interfaces/languages/LanguageDetails";
import { LanguageOption } from "@/interfaces/languages/LanguageOption";

export default function mapLanguagesToOptions(
  languagesDetails: LanguageDetails[]
): LanguageOption[] {
  const languagesOptions = languagesDetails.map((language) => ({
    name:
      language.name === language.nativeName
        ? language.name
        : `${language.name} (${language.nativeName})`,
    code: language.code,
  }));

  return languagesOptions;
}
