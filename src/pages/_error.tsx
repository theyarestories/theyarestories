import { highlightNextConfig } from "@/config/highlight-io/highlightNextConfig";
import {
  PageRouterErrorProps,
  pageRouterCustomErrorHandler,
} from "@highlight-run/next/ssr";
import NextError from "next/error";

export default pageRouterCustomErrorHandler(
  highlightNextConfig,
  /**
   *
   * This second argument is purely optional.
   * If you don't pass it, we'll use the default Next.js error page.
   *
   * Go ahead and pass in your own error page.
   */
  (props: PageRouterErrorProps) => <NextError {...props} />
);
