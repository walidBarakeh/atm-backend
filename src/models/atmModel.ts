export enum MoneyType {
  BILL = 'BILL',
  COIN = 'COIN'
}


export interface ATMInventory {
  denomination: number;
  count: number;
  type: MoneyType;
}

export interface WithdrawalResult {
  denomination: number;
  count: number;
}
