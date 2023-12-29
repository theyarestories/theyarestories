export default function sliceAtEndOfWord(
  inputString: string,
  index: number
): string {
  // Check if the index is within the bounds of the string
  if (index < 0 || index >= inputString.length) {
    return inputString; // Return the original string if the index is invalid
  }

  // Find the nearest space before or at the specified index
  const spaceIndex = inputString.lastIndexOf(" ", index);

  // Slice the string at the nearest space or at the specified index
  const slicedString = inputString.slice(
    0,
    spaceIndex !== -1 ? spaceIndex : index
  );

  return slicedString;
}
