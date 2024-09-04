import knex from 'knex';
import { dbConfig } from '../config/knex';

export const client = knex(dbConfig.development);
