import { SOCKET_EVENTS } from "@/constants";
import socket from "@/sockets"
import { toast } from "sonner";

export const registerChatHandlers = () => {
  socket.on(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, ({newMessage,notify}) => {
    console.log(newMessage);
    if(notify)toast.info(`New message from ${newMessage?.senderName || "someone"}`);
  });
};