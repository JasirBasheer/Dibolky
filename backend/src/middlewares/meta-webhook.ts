import { env } from "@/config";
import { Request, Response, NextFunction } from "express";
import crypto from 'node:crypto'

export const verifyMetaSignature = (req: Request, res: Response, next: NextFunction) => {
  console.log('meta signature started')
  const signature = req.headers["x-hub-signature"];
  if (!signature || typeof signature !== "string") {
    res.sendStatus(403);
    return;
  }
console.log('meta signature 2')

  const [, hash] = signature.split("=");
  const expectedHash = crypto
    .createHmac("sha1", env.META.API_VERSION)
    .update(JSON.stringify(req.body))
    .digest("hex");

console.log('meta signature 3')
console.log(hash , "hash", expectedHash,'expectedhash')
  // if (hash !== expectedHash) {
  //   res.sendStatus(403);
  //   return;
  // }
console.log('meta signature complete')
  next();
};

