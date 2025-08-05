import { ServerOptions } from 'socket.io';
import { env } from './env';

export const config = {
  socketOptions: {
    cors: {
      origin: "*",
      // origin: [env.BASE_URLS.FRONTEND],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'], 
  } satisfies Partial<ServerOptions>,
};
