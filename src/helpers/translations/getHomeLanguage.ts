import Cookies from "js-cookie";

export default function getHomeLanguage() {
  return Cookies.get("home_language");
}
