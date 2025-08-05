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
    CALL_REJECTED: "call-rejected", 
    CALL_ENDED: "call-ended", 
    RECEIVER_OFFLINE: "receiver-offline",  
    CANCEL_CALL: "cancel-call",  
    CALL_CANCELLED: "call-cancelled",  
  },

};
