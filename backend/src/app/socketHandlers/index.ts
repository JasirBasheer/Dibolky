import { Server, Socket } from "socket.io";
import { handleChatingEvents } from "./message-handler";
import { container } from "tsyringe";
import { IChatService } from "@/services";
import { handleUserEvents } from "./user-handler";

export const registerSocketEventHandlers = async (
  io: Server,
  socket: Socket
) => {
  const ChatService = container.resolve<IChatService>("ChatService");
  const user = socket.data.user;

  if (!user?.id) {
    console.warn(`Socket connection with missing user data. Socket ID: ${socket.id}`);
    return;
  }
  
  handleUserEvents(io, socket);
  handleChatingEvents(io, socket,ChatService);

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: User ID: ${user.id} | Socket ID: ${socket.id} | Reason: ${reason}`);
  });
};
