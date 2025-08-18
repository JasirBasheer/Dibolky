import { env } from "@/config";
import SimpleCrypto from "simple-crypto-js";

const crypto = new SimpleCrypto(env.CONFIG.TOKEN_SECRET!);

export const encryptToken = (token: string) => crypto.encrypt(token);
export const decryptToken = (encrypted: string) => crypto.decrypt(encrypted) as string;
