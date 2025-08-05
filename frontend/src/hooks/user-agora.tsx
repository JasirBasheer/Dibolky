import { useEffect } from "react";
import axios from "@/utils/axios";
import { loginRtmClient } from "@/utils/rtmSingleton";

export function useAgoraRtmLogin(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    async function login() {
      try {
        const res = await axios.get(`/api/entities/agora?userId=${userId}`);
        const { rtmToken } = res.data;
        await loginRtmClient(userId, rtmToken);
        console.log("RTM logged in");
      } catch (error) {
        console.error("Failed to login RTM client", error);
      }
    }

    login();
  }, [userId]);
}
