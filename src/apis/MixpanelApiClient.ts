import { H as HNext } from "@highlight-run/next/client";

export class MixpanelApiClient {
  /**
   * Send mix panel event
   * @param eventName
   * @param props
   */
  event(eventName: string, props: object = {}) {
    try {
      if ((window as any).mixpanel) {
        (window as any).mixpanel.track(eventName, props);
      }
    } catch (error: any) {
      console.log(error);
      HNext.consumeError(error, error.message);
    }
  }
}
