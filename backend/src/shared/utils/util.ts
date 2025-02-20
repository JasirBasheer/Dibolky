import { setTimeout } from 'timers/promises';

// Constants
const RETRY_ATTEMPTS = 3;
const RATE_LIMIT_DELAY = 5000;
const CONTAINER_STATUS_CHECK_INTERVAL = 2000;
const CONTAINER_STATUS_CHECK_TIMEOUT = 60000;

interface IGResponse {
  error?: {
    code: number;
    message: string;
    type: string;
    error_subcode?: number;
  };
  id?: string;
  status_code?: string;
}

async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.error?.code === 4 && i < attempts - 1) {
        await setTimeout(RATE_LIMIT_DELAY);
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Failed after ${attempts} attempts`);
}




import crypto from 'crypto'

export const getSecretRoomId = (userId:string) =>{
  return crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
}





