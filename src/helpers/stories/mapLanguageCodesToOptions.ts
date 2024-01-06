import { LanguageOption } from "@/interfaces/languages/LanguageOption";

export default function mapLanguageCodesToOptions(
  codes: string[],
  languagesOptions: LanguageOption[]
): LanguageOption[] {
  const result: LanguageOption[] = [];

  for (const code of codes) {
    const languageOption = languagesOptions.find(
      (option) => option.code === code
    );
    if (languageOption) result.push(languageOption);
  }

  return result;
}
