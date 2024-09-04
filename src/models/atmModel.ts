export enum MoneyType {
  BILL = 'BILL',
  COIN = 'COIN'
}


export const AllowedDenominationsSet = new Set([0.01, 0.1, 1, 5, 10, 20, 100, 200]);
export enum Denomination {
  COIN_0_01 = 0.01,
  COIN_0_1 = 0.1,
  COIN_1 = 1,
  COIN_5 = 5,
  COIN_10 = 10,
  BILL_20 = 20,
  BILL_100 = 100,
  BILL_200 = 200,
}


export interface ATMInventory {
  denomination: Denomination;
  count: number;
  type: MoneyType;
}

export type WithdrawalResult = Record<MoneyType, Record<Denomination, number>>;


export const MoneyTypeMap = {
  [Denomination.BILL_200]: MoneyType.BILL,
  [Denomination.BILL_100]: MoneyType.BILL,
  [Denomination.BILL_20]: MoneyType.BILL,
  [Denomination.COIN_10]: MoneyType.COIN,
  [Denomination.COIN_5]: MoneyType.COIN,
  [Denomination.COIN_1]: MoneyType.COIN,
  [Denomination.COIN_0_1]: MoneyType.COIN,
  [Denomination.COIN_0_01]: MoneyType.COIN,
}
