import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import { H as HNext } from "@highlight-run/next/client";

export class MixpanelApiClient {
  /**
   * Send mix panel event
   * @param eventName
   * @param props
   */
  event(eventName: MixpanelEvent, props: object = {}) {
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
