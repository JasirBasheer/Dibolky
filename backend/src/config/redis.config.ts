import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

async function connectRedis(): Promise<RedisClientType> {

  redisClient = createClient({
    socket: {
      host: "redis",
      port: 6379,
    },
  });

  redisClient.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  try {
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.log("Redis connection error:", err);
    process.exit(1);
  }
}

export const blacklistToken = async (
  tokenDetials: { id: string; role: string; iat: number; exp: number },
  token: string
): Promise<void> => {
  console.log(tokenDetials);
  try {
    const ttl = tokenDetials.exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) {
      return;
    }

    await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");
  } catch (error) {
    console.error("Error blacklisting token:", error);
    throw new Error("Failed to blacklist token");
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await redisClient.get(`bl_${token}`);
    return result !== null;
  } catch (error) {
    console.error("Error checking blacklist:", error);
    throw new Error("Failed to check token blacklist");
  }
};

function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error("Redis client has not been initialized. Call connectRedis() first."); 
  }
  return redisClient;
}

export { connectRedis, getRedisClient };
