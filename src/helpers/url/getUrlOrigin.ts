export default function getUrlOrigin(): string {
  let result = "";

  if (window) {
    result = window.location.origin;
  }

  return result;
}
