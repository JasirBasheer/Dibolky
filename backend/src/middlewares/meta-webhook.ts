import { META_API_VERSION } from "@/config";
import { Request, Response, NextFunction } from "express";
import crypto from 'node:crypto'

export const verifyMetaSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers["x-hub-signature"];
  if (!signature || typeof signature !== "string") {
    res.sendStatus(403);
    return;
  }

  const [, hash] = signature.split("=");
  const expectedHash = crypto
    .createHmac("sha1", META_API_VERSION)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== expectedHash) {
    res.sendStatus(403);
    return;
  }

  next();
};

