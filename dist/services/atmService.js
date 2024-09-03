"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refillATM = exports.withdrawAmount = exports.initializeDatabase = void 0;
const knexClient_1 = require("./knexClient");
const atmModel_1 = require("../models/atmModel");
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield knexClient_1.db.schema.dropTableIfExists('atm_inventory');
    yield knexClient_1.db.schema.createTable('atm_inventory', (table) => {
        table.float('denomination').notNullable();
        table.integer('count').notNullable();
        table.string('type').notNullable();
        table.primary(['denomination', 'type']);
    });
    const seedData = [
        { denomination: 200, count: 1, type: atmModel_1.MoneyType.BILL },
        { denomination: 100, count: 2, type: atmModel_1.MoneyType.BILL },
        { denomination: 20, count: 5, type: atmModel_1.MoneyType.BILL },
        { denomination: 10, count: 10, type: atmModel_1.MoneyType.BILL },
        { denomination: 1, count: 10, type: atmModel_1.MoneyType.BILL },
        { denomination: 5, count: 10, type: atmModel_1.MoneyType.BILL },
        { denomination: 0.1, count: 1, type: atmModel_1.MoneyType.BILL },
        { denomination: 0.01, count: 10, type: atmModel_1.MoneyType.BILL }
    ];
    yield (0, knexClient_1.db)('atm_inventory').insert(seedData);
});
exports.initializeDatabase = initializeDatabase;
const withdrawAmount = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    let remainingAmount = amount;
    let totalCoins = 0;
    let hasCoins = false;
    // Process bills first
    const bills = yield (0, knexClient_1.db)('atm_inventory').where({ type: 'BILL' }).orderBy('denomination', 'desc');
    for (const bill of bills) {
        const denom = bill.denomination;
        const count = Math.min(Math.floor(remainingAmount / denom), bill.count);
        if (count > 0) {
            results.push({ denomination: denom, count });
            remainingAmount -= count * denom;
            yield (0, knexClient_1.db)('atm_inventory').where({ denomination: denom, type: 'BILL' }).decrement('count', count);
        }
    }
    // Process coins only if necessary
    if (remainingAmount > 0) {
        const coins = yield (0, knexClient_1.db)('atm_inventory').where({ type: 'COIN' }).orderBy('denomination', 'desc');
        for (const coin of coins) {
            const denom = coin.denomination;
            const count = Math.min(Math.floor(remainingAmount / denom), coin.count);
            if (count > 0) {
                results.push({ denomination: denom, count });
                remainingAmount -= count * denom;
                totalCoins += count;
                hasCoins = true;
                yield (0, knexClient_1.db)('atm_inventory').where({ denomination: denom, type: 'COIN' }).decrement('count', count);
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
});
exports.withdrawAmount = withdrawAmount;
const refillATM = (denominations) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedDenominations = [0.01, 0.1, 1, 5, 10, 20, 100, 200];
    for (const item of denominations) {
        if (!allowedDenominations.includes(item.denomination) || (item.type !== 'BILL' && item.type !== 'COIN')) {
            throw new Error('Unknown denomination or type');
        }
    }
    for (const item of denominations) {
        yield (0, knexClient_1.db)('atm_inventory').insert(item).onConflict(['denomination', 'type']).merge();
    }
});
exports.refillATM = refillATM;
