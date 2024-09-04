import { Router } from 'express';
import { isDbConnectedCheck } from '../controllers/atmController';

const router = Router();

router.get('', async (_req, res) => {
  const isDbConnected = await isDbConnectedCheck();
  res.status(200).json({
    alive: isDbConnected,
    isDbConnected: isDbConnected,
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString()
  });
});

export default router;