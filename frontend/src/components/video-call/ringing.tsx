import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import axios from "@/utils/axios";

const VideoCall = ({ userId, userName }) => {
  const [recipientId, setRecipientId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [callType, setCallType] = useState("video"); 
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const client = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const rtmClient = useRef(null);
  const rtmChannel = useRef(null);

  const AGORA_APP_ID = "477e713fbd1d4e43ace7a34ea6c758b7"; 

  useEffect(() => {
    const init = async () => {
      try {

        rtmClient.current = AgoraRTM.createInstance(AGORA_APP_ID);
        const response = await axios.get(
          `/api/chat/agora?userId=${userId}&channelName=${channelName || "default"}`
        );
        const { rtmToken } = response.data;

        await rtmClient.current.login({ uid: userId, token: rtmToken });
        rtmChannel.current = rtmClient.current.createChannel(channelName || "default");
        await rtmChannel.current.join();

        rtmClient.current.on("MessageFromPeer", (message, peerId) => {
          const data = JSON.parse(message.text);
          if (data.type === "call_invite") {
            setIncomingCall({ callerId: peerId, channelName: data.channelName, callType: data.callType });
          }
        });

        rtmChannel.current.on("ChannelMessage", (message, senderId) => {
          const data = JSON.parse(message.text);
          if (data.type === "call_response" && data.recipientId === userId) {
            if (data.status === "accepted") {
              joinCall(data.channelName, data.callType);
            } else {
              alert("Call rejected by recipient");
              setInCall(false);
            }
          }
        });

        return () => {
          rtmChannel.current.leave();
          rtmClient.current.logout();
          client.current.leave();
        };
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };
    init();
  }, [userId, channelName]);


  const initiateCall = async () => {
    if (!recipientId || !channelName) {
      alert("Please select a recipient and enter a channel name");
      return;
    }
    try {
      const callData = { type: "call_invite", channelName, callType };
      await rtmClient.current.sendMessageToPeer(
        { text: JSON.stringify(callData) },
        recipientId
      );
      await axios.post("http://localhost:4000/api/calls", {
        callerId: userId,
        recipientId,
        channelName,
        callType,
        status: "initiated",
      });
      setInCall(true);
    } catch (error) {
      console.error("Failed to initiate call:", error);
      alert("Failed to initiate call");
    }
  };


  const acceptCall = async () => {
    try {
      await rtmChannel.current.sendMessage({
        text: JSON.stringify({
          type: "call_response",
          status: "accepted",
          recipientId: userId,
          channelName: incomingCall.channelName,
          callType: incomingCall.callType,
        }),
      });

      joinCall(incomingCall.channelName, incomingCall.callType);
      setIncomingCall(null);
    } catch (error) {
      console.error("Failed to accept call:", error);
      alert("Failed to accept call");
    }
  };


  const rejectCall = async () => {
    try {
      await rtmChannel.current.sendMessage({
        text: JSON.stringify({
          type: "call_response",
          status: "rejected",
          recipientId: userId,
          channelName: incomingCall.channelName,
          callType: incomingCall.callType,
        }),
      });
      await axios.post("http://localhost:4000/api/calls", {
        callerId: incomingCall.callerId,
        recipientId: userId,
        channelName: incomingCall.channelName,
        callType: incomingCall.callType,
        status: "rejected",
      });
      setIncomingCall(null);
    } catch (error) {
      console.error("Failed to reject call:", error);
      alert("Failed to reject call");
    }
  };

  const joinCall = async (channel, callType) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/chat/agora/tokens?userId=${userId}&channelName=${channel}`
      );
      const { rtcToken } = response.data;

      await client.current.join(AGORA_APP_ID, channel, rtcToken, userId);
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {}, 
        callType === "video" ? { encoderConfig: { width: 640, height: 480 } } : null
      );

      if (callType === "video" && tracks[1]) {
        tracks[1].play(localVideoRef.current);
      }
      await client.current.publish(tracks);

      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        if (mediaType === "video" && user.videoTrack) {
          user.videoTrack.play(remoteVideoRef.current);
        } else if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      setInCall(true);
    } catch (error) {
      console.error("Failed to join call:", error);
      alert("Failed to join call");
    }
  };

  // End call
  const endCall = async () => {
    await client.current.leave();
    setInCall(false);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>WhatsApp-like Video Call</h2>
      {!inCall && !incomingCall && (
        <div>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            <option value="">Select Contact</option>
          </select>
          <input
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <select value={callType} onChange={(e) => setCallType(e.target.value)}>
            <option value="video">Video Call</option>
            <option value="audio">Audio Call</option>
          </select>
          <button onClick={initiateCall}>Call</button>
        </div>
      )}
      {incomingCall && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h3>Incoming {incomingCall.callType} call from {incomingCall.callerId}</h3>
          <button onClick={acceptCall} style={{ marginRight: "10px" }}>
            Accept
          </button>
          <button onClick={rejectCall}>Reject</button>
        </div>
      )}
      {inCall && (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div>
            <h3>My Video</h3>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px" }} />
          </div>
          <div>
            <h3>Remote Video</h3>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
          </div>
          <button onClick={endCall}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;