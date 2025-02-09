import { createClient } from 'redis';


const redisClient = createClient({
 url:'redis://localhost:6379',
});

redisClient.connect().catch((err) => {
    console.log('Redis connection error:', err);
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error:', err);
});

export const blacklistToken = async (tokenDetials: any,token:string): Promise<void> => {
    try {
        const ttl = tokenDetials.exp - Math.floor(Date.now() / 1000);
        if (ttl <= 0) {
            return;
        }

       await redisClient.setEx(`bl_${token}`, ttl, 'blacklisted');
    } catch (error) {
        console.error('Error blacklisting token:', error);
        throw new Error('Failed to blacklist token');
    }
}

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    try {
        const result = await redisClient.get(`bl_${token}`);
        return result !== null;
    } catch (error) {
        console.error('Error checking blacklist:', error);
        throw new Error('Failed to check token blacklist');
    }
}


