import mixpanel from "mixpanel-browser";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import { H as HNext } from "@highlight-run/next/client";

export class MixpanelApiClient {
  constructor() {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, {
      debug: process.env.NEXT_PUBLIC_ENV !== "production",
    });
  }

  /**
   * Send mix panel event
   * @param eventName
   * @param props
   */
  event(eventName: MixpanelEvent, props: object = {}) {
    try {
      mixpanel.track(eventName, props);
    } catch (error: any) {
      console.log(error);
      HNext.consumeError(error, error.message);
    }
  }

  getUserId(): string {
    return mixpanel.get_distinct_id();
  }

  identifyById(id: string) {
    mixpanel.identify(id);
  }
}
