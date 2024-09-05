import { NextFunction, Request, Response } from 'express';
import { withdrawAmount, refillATM, checkDbConnection, getATMBalance } from '../services/atmService';
import { ErrorCodes, HttpError, InvalidParamsError } from '../config/consts';
import { Denomination } from '../models/atmModel';
import { isEmpty } from 'lodash';
import { isValidAmount } from '../utils/general';

export const handleWithdrawal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { amount } = req.body as { amount: number };
  try {
    if (!Number.isFinite(amount)) {
      throw new InvalidParamsError('amount must be a number');
    }
    if (amount < 0) {
      throw new InvalidParamsError('amount should be positive number');
    }

    if (amount > 2000) {
      throw new HttpError(ErrorCodes.UnprocessableEntity, 'illegal amount, maximum allowed amount is 2000');
    }
    if (!isValidAmount(String(amount))) {
      throw new InvalidParamsError('amount should be in 2 point decimal notation max');
    }
    const result = await withdrawAmount(amount);
    res.status(ErrorCodes.Ok).json({ result });
  } catch (error) {
    next(error);
  }
};

export const handleRefill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const denominations = req.body || ({} as { money: { [key in Denomination]: number } });
  try {
    if (isEmpty(denominations?.money)) {
      throw new InvalidParamsError('invalid money params');
    }

    await refillATM(denominations.money);
    res.status(ErrorCodes.Created).send('ATM refilled successfully');
  } catch (error) {
    next(error);
  }
};

export const currentBalance = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const balance = await getATMBalance();
    res.status(ErrorCodes.Ok).send({ balance });
  } catch (error) {
    next(error);
  }
};

export const isDbConnectedCheck = async (): Promise<boolean> => {
  try {
    await checkDbConnection();
    return true;
  } catch (error) {
    return false;
  }
};
