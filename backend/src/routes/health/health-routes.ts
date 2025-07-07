import { Router } from "express";


export const createHealthRoutes = (): Router => {
  const router = Router();

  router.get('/',(req, res) => {
    res.status(200).json({ status: 'ok' });
  })

  return router;
};


