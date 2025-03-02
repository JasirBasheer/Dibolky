import crypto from 'crypto'

export const getSecretRoomId = (userId:string) =>{
  return crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
}





