import { ServerOptions } from 'socket.io';
import { FRONTEND_BASE_URL } from './env';

export const config = {
  socketOptions: {
    cors: {
      origin: [FRONTEND_BASE_URL],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'], 
  } satisfies Partial<ServerOptions>,
};
