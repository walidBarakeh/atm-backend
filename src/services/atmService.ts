import { db } from './knexClient';
import { ATMInventory, WithdrawalResult, MoneyType } from '../models/atmModel'

export const initializeDatabase = async (): Promise<void> => {
  await db.schema.dropTableIfExists('atm_inventory');
  await db.schema.createTable('atm_inventory', (table) => {
    table.float('denomination').notNullable();
    table.integer('count').notNullable();
    table.string('type').notNullable();
    table.primary(['denomination', 'type']);
  });

  const seedData: ATMInventory[] = [
    { denomination: 200, count: 1, type: MoneyType.BILL },
    { denomination: 100, count: 2, type: MoneyType.BILL },
    { denomination: 20, count: 5, type: MoneyType.BILL },
    { denomination: 10, count: 10, type: MoneyType.BILL },
    { denomination: 1, count: 10, type: MoneyType.BILL },
    { denomination: 5, count: 10, type: MoneyType.BILL },
    { denomination: 0.1, count: 1, type: MoneyType.BILL },
    { denomination: 0.01, count: 10, type: MoneyType.BILL }
  ];

  await db('atm_inventory').insert(seedData);
};

export const withdrawAmount = async (amount: number): Promise<WithdrawalResult[]> => {
  const results: WithdrawalResult[] = [];
  let remainingAmount = amount;
  let totalCoins = 0;
  let hasCoins = false;

  // Process bills first
  const bills = await db('atm_inventory').where({ type: 'BILL' }).orderBy('denomination', 'desc');
  for (const bill of bills) {
    const denom = bill.denomination;
    const count = Math.min(Math.floor(remainingAmount / denom), bill.count);
    if (count > 0) {
      results.push({ denomination: denom, count });
      remainingAmount -= count * denom;
      await db('atm_inventory').where({ denomination: denom, type: 'BILL' }).decrement('count', count);
    }
  }

  // Process coins only if necessary
  if (remainingAmount > 0) {
    const coins = await db('atm_inventory').where({ type: 'COIN' }).orderBy('denomination', 'desc');
    for (const coin of coins) {
      const denom = coin.denomination;
      const count = Math.min(Math.floor(remainingAmount / denom), coin.count);
      if (count > 0) {
        results.push({ denomination: denom, count });
        remainingAmount -= count * denom;
        totalCoins += count;
        hasCoins = true;
        await db('atm_inventory').where({ denomination: denom, type: 'COIN' }).decrement('count', count);
      }
    }
  }

  if (remainingAmount > 0) {
    throw new Error('Not enough money available');
  }
  if (hasCoins && totalCoins > 50) {
    throw new Error('Too many coins');
  }
  return results;
};

export const refillATM = async (denominations: ATMInventory[]): Promise<void> => {
  const allowedDenominations = [0.01, 0.1, 1, 5, 10, 20, 100, 200];
  for (const item of denominations) {
    if (!allowedDenominations.includes(item.denomination) || (item.type !== 'BILL' && item.type !== 'COIN')) {
      throw new Error('Unknown denomination or type');
    }
  }
  for (const item of denominations) {
    await db('atm_inventory').insert(item).onConflict(['denomination', 'type']).merge();
  }
};
