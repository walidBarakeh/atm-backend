import knex from 'knex';
import { dbConfig } from './knex';

export const client = knex(dbConfig.development);
