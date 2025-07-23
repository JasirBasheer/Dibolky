export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  USER:{
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
    FETCH_HISTORY: "chat:fetch-history"  
  },
};
