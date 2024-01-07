import { NodeOptions } from "@highlight-run/node";

export const highlightNodeConfig: NodeOptions = {
  projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
  environment: process.env.NEXT_PUBLIC_ENV,
  serviceName: "theyarestories",
};
