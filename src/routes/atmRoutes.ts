import { Router } from 'express';
import { handleWithdrawal, handleRefill, currentBalance } from '../controllers/atmController';

const router = Router();

router.post('/withdraw', handleWithdrawal);
router.post('/refill', handleRefill);
router.get('/balance', currentBalance);

export default router;
