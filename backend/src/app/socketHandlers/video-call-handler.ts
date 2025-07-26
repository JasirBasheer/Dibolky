import { Server, Socket } from "socket.io";

export const handleVideoCallEvents = (
  io: Server,
  socket: Socket
) => {
  socket.on('video-call-initiate', ({ roomID, targetUserId, targetUserName, callerUserId, callerUserName, orgId }) => {
    console.log(`Video call initiated: ${callerUserName} calling ${targetUserName}`);
    
    io.to(`user_${targetUserId}`).emit('video-call-incoming', {
      roomID,
      callerInfo: {
        userId: callerUserId,
        userName: callerUserName,
      },
    });
  });

  socket.on('video-call-accept', ({ roomID, orgId }) => {
    console.log(`Video call accepted for room: ${roomID}`);
    
    socket.broadcast.to(`room_${roomID}`).emit('video-call-accepted', { roomID });
  });

  socket.on('video-call-reject', ({ roomID, orgId }) => {
    console.log(`Video call rejected for room: ${roomID}`);
    
    socket.broadcast.to(`room_${roomID}`).emit('video-call-rejected', { roomID });
  });

  socket.on('video-call-end', ({ roomID, orgId }) => {
    console.log(`Video call ended for room: ${roomID}`);
    
    socket.broadcast.to(`room_${roomID}`).emit('video-call-ended', { roomID });
  });
};
