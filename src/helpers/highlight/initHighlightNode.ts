import { highlightNodeConfig } from "@/config/highlight-io/highligntNodeConfig";
import { H } from "@highlight-run/node";

export default function initHighlightNode() {
  H.init(highlightNodeConfig);
}
