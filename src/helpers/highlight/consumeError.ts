import { H as HNext } from "@highlight-run/next/client";
import { H as HNode } from "@highlight-run/node";
import { isNode } from "browser-or-node";

export default function consumeError(
  error: any,
  metadata?: { [key: string]: string }
) {
  if (isNode) {
    HNode.consumeError(error, undefined, undefined, metadata);
  } else {
    HNext.consumeError(error, error.message, metadata);
  }
}
