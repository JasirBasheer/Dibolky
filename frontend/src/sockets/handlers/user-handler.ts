import { SOCKET_EVENTS } from "@/constants";
import socket from "@/sockets";

export const registerUserHandlers = (orgId: string, userId: string) => {
  if (userId && orgId) {
    socket.emit(SOCKET_EVENTS.USER.SET_ONLINE, { userId, orgId });
  }

  //   socket.on(SOCKET_EVENTS.USER.SET_ONLINE, () => {
  //     console.warn("disconnected from socket");
  //   });
};
