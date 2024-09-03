"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_var_1 = require("env-var");
const PORT = (0, env_var_1.get)('PORT').default(7001).asIntPositive();
app_1.default.listen(PORT, () => {
    console.log(`ATM service running on port ${PORT}`);
});
