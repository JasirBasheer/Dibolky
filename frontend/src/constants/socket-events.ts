export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  USER: {
    SET_ONLINE: "user:online",
    SET_OFFLINE: "user:offline",
  },

  CHAT: {
    CREATE_CHAT: "chat:create",
    SEND_MESSAGE: "chat:send-message",
    NEW_CHAT_CREATED: "chat:create-created",
    RECEIVE_MESSAGE: "chat:receive-message",
    DELETE_MESSAGE: "chat:delete-message",
    TYPING: "chat:typing",
    STOP_TYPING: "chat:stop-typing",
    MESSAGE_SEEN: "chat:message-seen",
    FETCH_HISTORY: "chat:fetch-history",
  },

  VIDEO_CALL: {
    INITIATE_CALL: "initiate-video-call",
    INCOMING_CALL: "incoming-video-call",
    ACCEPT_CALL: "accept-video-call",
    REJECT_CALL: "reject-video-call",
    END_CALL: "end-video-call",
    CALL_ACCEPTED: "call-accepted", 
    CALL_REJECTED: "call-rejected", // Emitted to caller when receiver rejects
    CALL_ENDED: "call-ended", // Emitted to all participants when call ends
    RECEIVER_OFFLINE: "receiver-offline", // New: Notify caller if receiver is offline
    CANCEL_CALL: "cancel-call", // New: Caller cancels before receiver accepts
    CALL_CANCELLED: "call-cancelled", // New: Notify receiver if caller cancels
  },

};
