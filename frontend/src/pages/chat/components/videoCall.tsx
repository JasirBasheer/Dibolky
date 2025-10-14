import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import { getRtmClient, destroyRtmClient } from "@/utils/rtmSingleton";
import { message } from "antd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import axios from "@/utils/axios";
import { RootState } from "@/types/common";
import { setInCall, resetCallState } from "@/redux/slices/ui.slice";
import { toast } from "sonner";

interface PeerData {
  chatId: string;
  userId: string;
  name: string;
  profileUrl?: string;
}

const AGORA_APP_ID = "477e713fbd1d4e43ace7a34ea6c758b7";

const VideoCall: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const inCall = useSelector((state: RootState) => state.ui.inCall);
  const outgoingCall = useSelector((state: RootState) => state.ui.outgoingCall);
  const prevOutgoingCall = useRef<{
    recipientId: string;
    callType: "audio" | "video";
  } | null>(null);

  const [incomingCall, setIncomingCall] = useState<{
    callerId: string;
    channelName: string;
    callType: "video" | "audio";
    from: string;
    chatId: string;
    callerName?: string;
    callerProfileUrl?: string;
  } | null>(null);

  const [currentCallType, setCurrentCallType] = useState<"video" | "audio">(
    "video"
  );
  const [remotePeer, setRemotePeer] = useState<PeerData | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const rtcClientRef = useRef<ReturnType<typeof AgoraRTC.createClient> | null>(
    null
  );
  const rtmClientRef = useRef<any>(null);
  const rtmChannelRef = useRef<any>(null);
  const localTracks = useRef<any[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const maxReconnectAttempts = 5;
  const reconnectDelayMs = 5000;
  const reconnectAttempts = useRef(0);

  const initRtmClient = async () => {
    if (rtmClientRef.current) return; 

    try {
      const rtm = getRtmClient();
      rtmClientRef.current = rtm;

      rtm.on("MessageFromPeer", (message, peerId) => {
        try {
          const data = JSON.parse(message.text);
          console.log(data, "messagefrompeer");
          if (data.type === "call_invite") {
            setIncomingCall({
              callerId: peerId,
              channelName: data.channelName,
              callType: data.callType,
              from: data.from,
              chatId: data.chatId,
              callerName: data.callerName || "Unknown",
              callerProfileUrl: data.callerProfileUrl || "",
            });
          }
        } catch (error) {
          console.error("Error parsing RTM peer message:", error);
        }
      });

      rtm.on("ConnectionStateChanged", (newState, reason) => {
        console.log(`RTM connection state changed to ${newState}: ${reason}`);
        if (reason === "LOGIN_TOO_OFTEN" || reason === "REMOTE_LOGIN") {
          message.error(
            "Disconnected due to multiple logins. Retrying connection..."
          );
          reconnectAttempts.current = 0;
          reconnectRtm();
        }
      });
    } catch (error) {
      console.error("RTM client init error:", error);
    }
  };

  useEffect(() => {
    console.log("triggered", prevOutgoingCall);
    // if (
    //   outgoingCall &&
    //   (prevOutgoingCall.current === null ||
    //     prevOutgoingCall.current.recipientId !== outgoingCall.recipientId)
    // ) {
    if (outgoingCall && outgoingCall?.callType && outgoingCall?.recipientId) {
      prevOutgoingCall.current = outgoingCall;
      doStartCall(outgoingCall);
    }
    // }
  }, [outgoingCall]);

  useEffect(() => {
    if (
      inCall &&
      currentCallType === "video" &&
      localTracks.current[1] &&
      localVideoRef.current
    ) {
      localTracks.current[1].play(localVideoRef.current);
    }
  }, [inCall, currentCallType]);

  function shortId(uid) {
    return (uid || "").replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 8);
  }

  function getSafeChannelName(userId1: string, userId2: string) {
    return `call_${[shortId(userId1), shortId(userId2)]
      .sort()
      .join("_")}_${Date.now().toString(36)}`;
  }

  const doStartCall = async ({
    recipientId,
    callType,
    chatId,
  }: {
    recipientId: string;
    callType: "audio" | "video";
    chatId: string;
  }) => {
    if (!user || !user.user_id) {
      message.error("User not logged in");
      return;
    }
    const channelName = getSafeChannelName(user.user_id, recipientId);
    const rtm = getRtmClient();

    try {
      await rtm.sendMessageToPeer(
        {
          text: JSON.stringify({
            type: "call_invite",
            channelName,
            callType,
            chatId,
            from: user.user_id,
            callerName: user.name,
            callerProfile: user.profile || "",
          }),
        },
        recipientId
      );

      if (rtmChannelRef.current) {
        await rtmChannelRef.current.leave();
        rtmChannelRef.current = null;
      }

      const channel = rtm.createChannel(channelName);
      await channel.join();
      rtmChannelRef.current = channel;

      channel.on("ChannelMessage", async (message, senderId) => {
        console.log("messageeee", message, user.user_id);
        try {
          const data = JSON.parse(message.text);
          if (data.type === "call_response" && data.from == user.user_id) {
            if (data.status === "accepted") {
              setRemotePeer({
                userId: senderId,
                chatId: data.chatId,
                name: data.callerName,
                profileUrl: data.callerProfileUrl,
              });
              await joinRtcCall(data.channelName, data.callType);
            } else {
              toast.error("Call rejected");
              await cleanupAfterCallEnd();
            }
          }
        } catch {
          toast.error("Call rejected");
          await cleanupAfterCallEnd();
        }
      });
    } catch (error) {
      console.error("Failed during call setup:", error);
      toast.error("The user is currently offline.");
      await cleanupAfterCallEnd();
    }
  };

  const reconnectRtm = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      message.error("Max RTM reconnect attempts reached, please refresh.");
      return;
    }
    reconnectAttempts.current++;
    setTimeout(() => {
      if (user.user_id) {
        initRtmClient();
      }
    }, reconnectDelayMs * Math.pow(2, reconnectAttempts.current));
  };

  const joinRtmChannel = async (channelName: string) => {
    if (!rtmClientRef.current || rtmChannelRef.current) return;
    if (rtmChannelRef.current) {
      try {
        await rtmChannelRef.current.leave();
      } catch (e) {
        console.warn("Error leaving existing RTM channel:", e);
      }
      rtmChannelRef.current = null;
    }

    try {
      const channel = rtmClientRef.current.createChannel(channelName);
      await channel.join();
      rtmChannelRef.current = channel;

      channel.on("ChannelMessage", async (message, senderId) => {
        try {
          const data = JSON.parse(message.text);
          console.log(data, "datafromjoinrtmchannel");
          if (
            data.type === "call_response" &&
            data.recipientId === user.user_id
          ) {
            if (data.status === "accepted") {
              setRemotePeer({
                userId: senderId,
                chatId: data.chatId,
                name: data.callerName || "Unknown",
                profileUrl: data.callerProfileUrl || "",
              });
              await joinRtcCall(data.channelName, data.callType);
            } else {
              toast.error("Call rejected by the recipient");
              await cleanupAfterCallEnd();
            }
          }
        } catch (error) {
          toast.error("Call rejected by the recipient");
          await cleanupAfterCallEnd();
          console.error("Error processing RTM channel message:", error);
        }
      });
    } catch (error) {
      toast.error("Call rejected by the recipient");
      await cleanupAfterCallEnd();
      console.error("Failed to join RTM channel:", error);
    }
  };

  const joinRtcCall = async (
    channelName: string,
    callType: "video" | "audio"
  ) => {
    try {
      let client = rtcClientRef.current;

      if (client) {
        try {
          await client.leave();
        } catch (e) {
          console.warn("Error leaving previous RTC channel:", e);
        }
      }

      const { data } = await axios.get(
        `/api/chat/agora?userId=${user.user_id}&channelName=${channelName}`
      );
      const rtcToken = data.rtcToken;

      client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      rtcClientRef.current = client;

      await client.join(AGORA_APP_ID, channelName, rtcToken, user.user_id);

      if (callType === "video") {
        localTracks.current = await AgoraRTC.createMicrophoneAndCameraTracks(
          {},
          { encoderConfig: { width: 640, height: 480 } }
        );
        if (localVideoRef.current)
          localTracks.current[1].play(localVideoRef.current);
      } else {
        localTracks.current = [await AgoraRTC.createMicrophoneAudioTrack()];
      }

      await client.publish(localTracks.current);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setTimeout(() => {
          if (
            mediaType === "video" &&
            user.videoTrack &&
            remoteVideoRef.current
          ) {
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
          }
        }, 300);
      });

      dispatch(setInCall(true));
      setCurrentCallType(callType);
      setCurrentChannel(channelName);
    } catch (error) {
      console.error("RTC join error:", error);
    }
  };

  const acceptCall = async () => {
    console.log(incomingCall, "incomming calleeee");
    if (!incomingCall) return;
    try {
      console.log("accept call passed");
      console.log(incomingCall.channelName);

      await joinRtmChannel(incomingCall.channelName);
      await rtmChannelRef.current.sendMessage({
        text: JSON.stringify({
          type: "call_response",
          status: "accepted",
          recipientId: user.user_id,
          from: incomingCall.from,
          channelName: incomingCall.channelName,
          callType: incomingCall.callType,
          callerName: user.name || "Unknown",
          callerProfileUrl: user.profile || "",
        }),
      });
      setRemotePeer({
        userId: incomingCall.callerId,
        chatId: incomingCall.chatId,
        name: incomingCall.callerName || "Unknown",
        profileUrl: incomingCall.callerProfileUrl || "",
      });
      await joinRtcCall(incomingCall.channelName, incomingCall.callType);
      setIncomingCall(null);
    } catch (error) {
      console.error("Failed to accept call:", error);
      message.error("Failed to accept call");
    }
  };

  const rejectCall = async () => {
    prevOutgoingCall.current = null;
    if (!incomingCall) return;
    try {
      await joinRtmChannel(incomingCall.channelName);
      await rtmChannelRef.current.sendMessage({
        text: JSON.stringify({
          type: "call_response",
          status: "rejected",
          from: incomingCall.from,
          recipientId: user.user_id,
          channelName: incomingCall.channelName,
          callType: incomingCall.callType,
        }),
      });
      setIncomingCall(null);
      await cleanupAfterCallEnd();
    } catch (error) {
      console.error("Failed to reject call:", error);
      await cleanupAfterCallEnd();

    }
  };

  const endCall = async () => {
    try {
      localTracks.current.forEach((t) => {
        t.stop();
        t.close();
      });
      localTracks.current = [];

      if (rtcClientRef.current) {
        await rtcClientRef.current.leave();
        rtcClientRef.current = null;
      }
      if (rtmChannelRef.current) {
        await rtmChannelRef.current.leave();
        rtmChannelRef.current = null;
      }

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      setIsAudioMuted(false);
      setIsVideoMuted(false);
      await cleanupAfterCallEnd();
    } catch (error) {
      console.error("Failed to end call:", error);
      message.error("Failed to end call");
    }
  };

  const toggleAudio = async () => {
    if (localTracks.current[0]) {
      await localTracks.current[0].setMuted(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = async () => {
    if (currentCallType === "video" && localTracks.current[1]) {
      await localTracks.current[1].setMuted(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  useEffect(() => {
    if (user.user_id) {
      initRtmClient();
    }
    return () => {
      if (rtmChannelRef.current) {
        rtmChannelRef.current.leave().catch(console.error);
        rtmChannelRef.current = null;
      }
      if (rtmClientRef.current) {
        destroyRtmClient().catch(console.error);
        rtmClientRef.current = null;
      }
      if (rtcClientRef.current) {
        rtcClientRef.current.leave().catch(console.error);
        rtcClientRef.current = null;
      }
      dispatch(resetCallState());
    };
  }, [user.user_id, dispatch]);

  const cleanupAfterCallEnd = async () => {
    try {
      prevOutgoingCall.current = null;
      dispatch(resetCallState());
      dispatch(setInCall(false));
      setCurrentChannel(null);
      setRemotePeer(null);

      // Clean up RTM channel
      if (rtmChannelRef.current) {
        try {
          await rtmChannelRef.current.leave();
        } catch (e) {
          console.warn("Error leaving RTM channel:", e);
        }
        rtmChannelRef.current = null;
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  return (
    <>
      {incomingCall && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage
                  src={incomingCall.callerProfileUrl}
                  alt={incomingCall.callerName}
                />
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  {incomingCall.callerName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-gray-900">
                {incomingCall.callerName || "Unknown"}
              </h3>
              <p className="text-sm text-gray-500">
                Incoming {incomingCall.callType} call
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={rejectCall}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
                >
                  <PhoneOff size={24} />
                </button>
                <button
                  onClick={acceptCall}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                >
                  <Phone size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inCall && (
        <div className="absolute inset-0 bg-gray-900 z-40 flex flex-col">
          <div className="flex-1 relative">
            {currentCallType === "video" ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarFallback className="bg-gray-600 text-white text-3xl">
                      {remotePeer?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {remotePeer?.name || "Unknown"}
                  </h3>
                  <p className="text-gray-300">Audio Call</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-800">
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${
                  isAudioMuted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white`}
              >
                {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {currentCallType === "video" && (
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoMuted
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-600 hover:bg-gray-700"
                  } text-white`}
                >
                  {isVideoMuted ? (
                    <VideoOff size={24} />
                  ) : (
                    <VideoIcon size={24} />
                  )}
                </button>
              )}

              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCall;
