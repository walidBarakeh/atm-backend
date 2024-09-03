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
exports.handleRefill = exports.handleWithdrawal = exports.initializeATM = void 0;
const atmService_1 = require("../services/atmService");
const initializeATM = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, atmService_1.initializeDatabase)();
        res.status(200).send('ATM initialized');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.initializeATM = initializeATM;
const handleWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    try {
        const result = yield (0, atmService_1.withdrawAmount)(amount);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(422).send(error);
    }
});
exports.handleWithdrawal = handleWithdrawal;
const handleRefill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const denominations = req.body;
    try {
        yield (0, atmService_1.refillATM)(denominations);
        res.status(200).send('ATM refilled');
    }
    catch (error) {
        res.status(422).send(error);
    }
});
exports.handleRefill = handleRefill;
