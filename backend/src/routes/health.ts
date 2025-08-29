import { Router } from "express";


export const createHealthRoutes = (): Router => {
  const router = Router();

  router.get('/health', (req, res) => {
  res.status(200).send('ok');
  });

  return router;
};


