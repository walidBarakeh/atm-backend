import { Knex } from 'knex';
import { ATMInventory, Denomination, MoneyTypeMap } from '../models/atmModel';
import { ATM_TABLE_NAME } from '../config/consts';

export async function seed(knex: Knex) {
  const seedData: ATMInventory[] = [
    {
      denomination: Denomination.BILL_200,
      count: 1,
      type: MoneyTypeMap[Denomination.BILL_200],
    },
    {
      denomination: Denomination.BILL_100,
      count: 2,
      type: MoneyTypeMap[Denomination.BILL_100],
    },
    {
      denomination: Denomination.BILL_20,
      count: 5,
      type: MoneyTypeMap[Denomination.BILL_20],
    },
    {
      denomination: Denomination.COIN_10,
      count: 10,
      type: MoneyTypeMap[Denomination.COIN_10],
    },
    {
      denomination: Denomination.COIN_5,
      count: 10,
      type: MoneyTypeMap[Denomination.COIN_5],
    },
    {
      denomination: Denomination.COIN_1,
      count: 10,
      type: MoneyTypeMap[Denomination.COIN_1],
    },
    {
      denomination: Denomination.COIN_0_1,
      count: 1,
      type: MoneyTypeMap[Denomination.COIN_0_1],
    },
    {
      denomination: Denomination.COIN_0_01,
      count: 10,
      type: MoneyTypeMap[Denomination.COIN_0_01],
    },
  ];

  await knex(ATM_TABLE_NAME).insert(seedData).onConflict('denomination').merge();
}
