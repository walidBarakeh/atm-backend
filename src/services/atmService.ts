import { client } from '../config/knexClient';
import {
  ATMInventory,
  WithdrawalResult,
  MoneyType,
  Denomination,
  MoneyTypeMap,
  AllowedDenominationsSet,
} from '../models/atmModel';
import { ATM_TABLE_NAME, ErrorCodes, HttpError } from '../config/consts';

export const withdrawAmount = async (amount: number): Promise<WithdrawalResult> => {
  const result = {
    [MoneyType.BILL]: {},
    [MoneyType.COIN]: {},
  } as WithdrawalResult;
  let remainingAmount = amount;
  let numberOfCoins = 0;
  const atmInventory = await getATMBalance();

  const trx = await client.transaction();

  try {
    for (const money of atmInventory) {
      const denom = money.denomination;
      const count = Math.min(Math.floor(remainingAmount / denom), money.count);
      if (count > 0) {
        result[money.type][money.denomination] = count;
        const newRemaining = remainingAmount - count * denom;
        remainingAmount = Math.round(newRemaining * 100) / 100; // a hack for javascript issue - console.log(55.66 - 40); // Output: 15.659999999999997
        numberOfCoins += money.type === MoneyType.COIN ? count : 0;
        await trx<ATMInventory>(ATM_TABLE_NAME).where({ denomination: denom }).decrement('count', count);
      }
      if (remainingAmount <= 0) break;
    }

    if (remainingAmount > 0) {
      throw new HttpError(ErrorCodes.Conflict, 'Not enough money available', {
        currentBalance: atmInventory,
      });
    }
    if (numberOfCoins > 50) {
      throw new HttpError(ErrorCodes.UnprocessableEntity, 'Too many coins');
    }
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const refillATM = async (denominations: {
  [key in Denomination]: number;
}): Promise<void> => {
  for (const [key, value] of Object.entries(denominations)) {
    if (!AllowedDenominationsSet.has(Number(key))) {
      throw new HttpError(ErrorCodes.UnprocessableEntity, `denomination ${key} is not supported`);
    }
    if (!Number.isFinite(value) || value < 0) {
      throw new HttpError(ErrorCodes.UnprocessableEntity, `the count of denomination ${key} is not valid`);
    }
  }
  const trx = await client.transaction();
  try {
    const queries = Object.entries(denominations).map(([key, value]) =>
      trx(ATM_TABLE_NAME)
        .insert({
          denomination: Number(key),
          count: value,
          type: MoneyTypeMap[key as unknown as Denomination],
        })
        .onConflict('denomination')
        .merge({ count: client.raw('?? + ?', ['count', value]) }),
    );
    await Promise.all(queries);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    console.error('Error refilling ATM:', error);
    throw new Error('Failed to refill the ATM.');
  }
};

export const getATMBalance = async (): Promise<ATMInventory[]> => {
  return client<ATMInventory>(ATM_TABLE_NAME).orderBy('denomination', 'desc');
};

export const checkDbConnection = async (): Promise<void> => {
  await client.raw('select 1+1 as result');
};
