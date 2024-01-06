import { LanguageOption } from "@/interfaces/languages/LanguageOption";

export default function getLanguageByCode(
  languagesOptions: LanguageOption[],
  code: string
): LanguageOption | null {
  const result = languagesOptions.find((lang) => lang.code === code);

  return result || null;
}
