import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { useEffect, useState } from "react";

const mixpanelApiClient = new MixpanelApiClient();

export default function useMixpanelId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(mixpanelApiClient.getUserId());
  }, []);

  return userId;
}
