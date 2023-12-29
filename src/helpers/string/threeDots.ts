import sliceAtEndOfWord from "./sliceAtEndOfWord";

export default function threeDots(
  string: string,
  maxLettersCount: number
): string {
  if (string.length <= maxLettersCount) return string;

  string = sliceAtEndOfWord(string, maxLettersCount - 3) + "...";

  return string;
}
