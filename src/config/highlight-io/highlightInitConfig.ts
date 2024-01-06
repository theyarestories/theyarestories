import { HighlightInitProps } from "@highlight-run/next/ssr";

export const highlightInitConfig: HighlightInitProps = {
  projectId: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
  environment: process.env.NEXT_PUBLIC_ENV,
  serviceName: "theyarestories",
  tracingOrigins: true,
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: [],
  },
};
