import {
  UnauthorizedError,
  verifyToken,
} from "mern.common";
import { JWT_ACCESS_SECRET } from "../config/env";
import { ExtendedError, Socket } from "socket.io";
import cookie from "cookie";

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
): Promise<void> => {
  try {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    const token = cookies.accessToken;

    let accessTokenSecret = JWT_ACCESS_SECRET || "defaultAccessSecret";
    if (!token) throw new UnauthorizedError("Access Denied");

    const { id, role } = await verifyToken(accessTokenSecret, token ?? "");

    if (!id || !role) {
      throw new UnauthorizedError("invalid accesstoken");
    }
    
    socket.data.user = { id, role };
    next();
  } catch (error) {
    next(error);
  }
};
