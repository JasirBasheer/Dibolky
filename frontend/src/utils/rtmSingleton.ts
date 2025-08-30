import AgoraRTM from "agora-rtm-sdk";

const AGORA_APP_ID = "477e713fbd1d4e43ace7a34ea6c758b7";

let rtmClientInstance = null;
let loginPromise: Promise<void> | null = null;
let loggedIn = false;

export function getRtmClient() {
  if (!rtmClientInstance) {
    rtmClientInstance = AgoraRTM.createInstance(AGORA_APP_ID);
    rtmClientInstance.on("ConnectionStateChanged", (newState: string) => {
      loggedIn = newState === "CONNECTED";
    });
  }
  return rtmClientInstance;
}

export async function loginRtmClient(uid: string, token: string): Promise<void> {
  if (loggedIn) return;
  if (loginPromise) return loginPromise;

  const client = getRtmClient();
  loginPromise = client
    .login({ uid, token })
    .then(() => {
      loggedIn = true;
      loginPromise = null;
    })
    .catch((error) => {
      loginPromise = null;
      if (error.code === 8) {
        loggedIn = true; 
      } else {
        loggedIn = false;
        throw error;
      }
    });

  return loginPromise;
}

export function isRtmLoggedIn(): boolean {
  return loggedIn;
}

export async function logoutRtmClient(): Promise<void> {
  if (rtmClientInstance && loggedIn) {
    try {
      await rtmClientInstance.logout();
    } catch (e) {
      console.error("Error logging out RTM client:", e);
    }
    loggedIn = false;
    loginPromise = null;
  }
}

export async function destroyRtmClient(): Promise<void> {
  if (rtmClientInstance) {
    await logoutRtmClient();
    rtmClientInstance = null;
  }
}
