import { HighlightInitProps } from "@highlight-run/next/ssr";

export const highlightNextConfig: HighlightInitProps = {
  projectId: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
  environment: process.env.NEXT_PUBLIC_ENV,
  serviceName: "theyarestories",
  tracingOrigins: ["localhost", process.env.NEXT_PUBLIC_SERVER_URL],
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: [],
  },
  disableSessionRecording: true,
};
