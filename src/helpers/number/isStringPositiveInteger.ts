export default function isStringPositiveInteger(string: string): boolean {
  const toNumber = Number(string);
  const result = !isNaN(toNumber) && toNumber > 0;
  return result;
}
