import { Knex } from 'knex';
import { ATM_TABLE_NAME } from '../config/consts';

export async function up(knex: Knex) {
  await knex.schema.dropTableIfExists(ATM_TABLE_NAME);

  await knex.schema.createTable(ATM_TABLE_NAME, (table) => {
    table.float('denomination').notNullable();
    table.integer('count').notNullable();
    table.enum('type', ['COIN', 'BILL']).notNullable();
    table.primary(['denomination']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ATM_TABLE_NAME);
}
