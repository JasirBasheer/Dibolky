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
    
    // Notify all participants that call was accepted
    socket.broadcast.to(`room_${roomID}`).emit('video-call-accepted', { roomID });
  });

  socket.on('video-call-reject', ({ roomID, orgId }) => {
    console.log(`Video call rejected for room: ${roomID}`);
    
    // Notify all participants that call was rejected
    socket.broadcast.to(`room_${roomID}`).emit('video-call-rejected', { roomID });
  });

  socket.on('video-call-end', ({ roomID, orgId }) => {
    console.log(`Video call ended for room: ${roomID}`);
    
    // Notify all participants that call ended
    socket.broadcast.to(`room_${roomID}`).emit('video-call-ended', { roomID });
  });
};
