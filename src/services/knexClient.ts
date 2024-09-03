import knex from 'knex';
import { dbConfig } from '../config/knex';

export const db = knex(dbConfig.development);
