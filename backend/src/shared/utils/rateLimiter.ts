import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, 
  handler: (req: Request, res: Response) => {
    console.log(`Rate limit exceeded: ${req.method} ${req.url}`)
    res.status(429).json({
      message: `You are blocked`,
    });
  },
});


export default limiter;
