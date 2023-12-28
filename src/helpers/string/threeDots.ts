export default function threeDots(
  string: string,
  maxLettersCount: number
): string {
  if (string.length <= maxLettersCount) return string;

  return string.slice(0, maxLettersCount - 3) + "...";
}
