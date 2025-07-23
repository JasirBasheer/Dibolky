export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  USER:{
    SET_ONLINE: "user:online", 
    SET_OFFLINE: "user:offline", 
  },

  CHAT: {
    CREATE_CHAT: "chat:create", 
    NEW_CHAT_CREATED: "chat:create-created", 
    SEND_MESSAGE: "chat:send-message", 
    DELETE_MESSAGE: "chat:delete-message", 
    RECEIVE_MESSAGE: "chat:receive-message", 
    TYPING: "chat:typing",               
    STOP_TYPING: "chat:stop-typing",     
    MESSAGE_SEEN: "chat:message-seen",
  },
};
