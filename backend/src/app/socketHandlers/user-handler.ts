import { SOCKET_EVENTS } from "@/constants/socket-events";
import { activeUsers } from "@/utils/socket";
import { Server, Socket } from "socket.io";

export const handleUserEvents = (
  io: Server,
  socket: Socket
) => {
  
  socket.on(SOCKET_EVENTS.USER.SET_ONLINE, ({ orgId, userId }) => {
    if (!activeUsers.has(orgId)) {
      activeUsers.set(orgId, new Set());
    }

    activeUsers.get(orgId).add(userId);

    socket.join(`org_${orgId}`);
    socket.join(`user_${userId}`);

    io.to(`org_${orgId}`).emit("active-users", {
      users: Array.from(activeUsers.get(orgId)),
    });
  });

  socket.on(SOCKET_EVENTS.USER.SET_OFFLINE, ({ orgId, userId }) => {
    const orgUsers = activeUsers.get(orgId);

    if (orgUsers && orgUsers.has(userId)) {
      orgUsers.delete(userId);

      if (orgUsers.size === 0) {
        activeUsers.delete(orgId);
      }
    }

    socket.leave(`org_${orgId}`);
    socket.leave(`user_${userId}`);

    io.to(`org_${orgId}`).emit("active-users", {
      users: Array.from(activeUsers.get(orgId) || []),
    });
  });
};
