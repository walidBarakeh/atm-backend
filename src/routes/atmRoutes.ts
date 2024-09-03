import { Router } from 'express';
import { initializeATM, handleWithdrawal, handleRefill } from '../controllers/atmController';

const router = Router();

router.post('/initialize', initializeATM);
router.post('/withdraw', handleWithdrawal);
router.post('/refill', handleRefill);

export default router;
