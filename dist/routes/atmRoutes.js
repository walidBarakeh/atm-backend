"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const atmController_1 = require("../controllers/atmController");
const router = (0, express_1.Router)();
router.post('/initialize', atmController_1.initializeATM);
router.post('/withdraw', atmController_1.handleWithdrawal);
router.post('/refill', atmController_1.handleRefill);
exports.default = router;
