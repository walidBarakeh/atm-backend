import { client } from './knexClient';
import { ATMInventory, WithdrawalResult, MoneyType, Denomination, MoneyTypeMap, AllowedDenominationsSet } from '../models/atmModel'
import { ErrorCodes, HttpError } from '../config/consts';

export const initializeDatabase = async (): Promise<void> => {
    await client.schema.dropTableIfExists('atm_inventory');
    await client.schema.createTable('atm_inventory', (table) => {
        table.float('denomination').notNullable();
        table.integer('count').notNullable();
        table.enum('type', Object.values(MoneyType)).notNullable();
        table.primary(['denomination']);
    });

    const seedData: ATMInventory[] = [
        { denomination: Denomination.BILL_200, count: 1, type: MoneyTypeMap[Denomination.BILL_200] },
        { denomination: Denomination.BILL_100, count: 2, type: MoneyTypeMap[Denomination.BILL_100] },
        { denomination: Denomination.BILL_20, count: 5, type: MoneyTypeMap[Denomination.BILL_20] },
        { denomination: Denomination.COIN_10, count: 10, type: MoneyTypeMap[Denomination.COIN_10] },
        { denomination: Denomination.COIN_5, count: 10, type: MoneyTypeMap[Denomination.COIN_5] },
        { denomination: Denomination.COIN_1, count: 10, type: MoneyTypeMap[Denomination.COIN_1] },
        { denomination: Denomination.COIN_0_1, count: 1, type: MoneyTypeMap[Denomination.COIN_0_1] },
        { denomination: Denomination.COIN_0_01, count: 10, type: MoneyTypeMap[Denomination.COIN_0_01] }
    ];

    await client('atm_inventory').insert(seedData);
};

export const withdrawAmount = async (amount: number): Promise<WithdrawalResult> => {
    const result = { [MoneyType.BILL]: {}, [MoneyType.COIN]: {} } as WithdrawalResult;
    let remainingAmount = amount;
    let numberOfCoins = 0;
    const atmInventory = await client<ATMInventory>('atm_inventory').orderBy('denomination', 'desc');

    const trx = await client.transaction();

    try {
        for (const money of atmInventory) {
            const denom = money.denomination;
            const count = Math.min(Math.floor(remainingAmount / denom), money.count);
            if (count > 0) {
                result[money.type][money.denomination] = count;
                const newRemaining = remainingAmount - (count * denom);
                remainingAmount = Math.round(newRemaining * 100) / 100; // a hack for javascript issue - console.log(55.66 - 40); // Output: 15.659999999999997
                numberOfCoins += money.type === MoneyType.COIN ? 0 : count;
                await trx<ATMInventory>('atm_inventory').where({ denomination: denom }).decrement('count', count);
            }
            if (remainingAmount <= 0) break;
        }

        if (remainingAmount > 0) {
            throw new HttpError(ErrorCodes.Conflict, 'Not enough money available', { currentBalance: atmInventory });
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

export const refillATM = async (denominations: { [key in Denomination]: number }): Promise<void> => {

    for (const key of Object.keys(denominations)) {
        if (!AllowedDenominationsSet.has(Number(key))) {
            throw new HttpError(ErrorCodes.UnprocessableEntity, `denomination ${key} is not supported`);
        }
    }
    const trx = await client.transaction();
    try {
        const queries = Object.entries(denominations).map(([key, value]) =>
            trx('atm_inventory')
                .insert({ denomination: Number(key), count: value, type: MoneyTypeMap[key as unknown as Denomination] })
                .onConflict('denomination')
                .merge({ count: client.raw('?? + ?', ['count', value]) }))
        await Promise.all(queries);
        await trx.commit()
    } catch (error) {
        await trx.rollback();
        console.error('Error refilling ATM:', error);
        throw new Error('Failed to refill the ATM.')
    }
};

export const getATMBalance = async (): Promise<ATMInventory[]> => {
    return client<ATMInventory>('atm_inventory').orderBy('denomination', 'desc');
}

export const checkDbConnection = async (): Promise<void> => {
    await client.raw('select 1+1 as result');
};
