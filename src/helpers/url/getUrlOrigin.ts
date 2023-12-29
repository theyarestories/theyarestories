export default function getUrlOrigin(): string {
  let result = "";

  if (typeof window !== "undefined") {
    result = window.location.origin;
  }

  return result;
}
