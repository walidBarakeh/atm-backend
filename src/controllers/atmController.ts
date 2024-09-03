import { Request, Response } from 'express';
import { withdrawAmount, refillATM, initializeDatabase } from '../services/atmService';
import { ErrorCodes } from '../config/consts';

export const initializeATM = async (_req: Request, res: Response): Promise<void> => {
  try {
    await initializeDatabase();
    res.status(ErrorCodes.Created).send('ATM initialized');
  } catch (error) {
    res.status(500).send(ErrorCodes.InternalServerError);
  }
};

export const handleWithdrawal = async (req: Request, res: Response): Promise<void> => {
  const { amount } = req.body;
  try {
    const result = await withdrawAmount(amount);
    res.status(ErrorCodes.Ok).json(result);
  } catch (error) {
    res.status(422).send(error);
  }
};

export const handleRefill = async (req: Request, res: Response): Promise<void> => {
  const denominations = req.body;
  try {
    await refillATM(denominations);
    res.status(ErrorCodes.Ok).send('ATM refilled');
  } catch (error) {
    res.status(422).send(error);
  }
};
