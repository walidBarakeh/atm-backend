"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const env_var_1 = require("env-var");
const debug = (0, env_var_1.get)('DEBUG').default('false').asBool();
exports.dbConfig = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:' // Use an in-memory SQLite database
        },
        debug,
        useNullAsDefault: true
    }
};
