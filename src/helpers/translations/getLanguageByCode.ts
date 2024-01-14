import { LanguageOption } from "@/interfaces/languages/LanguageOption";
import mapLanguagesToOptions from "./mapLanguagesToOptions";
import allLanguages from "@/config/all-languages/allLanguages";

const languagesOptions = mapLanguagesToOptions(allLanguages);

export default function getLanguageByCode(code: string): LanguageOption | null {
  const result = languagesOptions.find((lang) => lang.code === code);

  return result || null;
}
