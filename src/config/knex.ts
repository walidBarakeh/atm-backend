import { get } from 'env-var';
import { Knex } from 'knex';



const debug = get('DEBUG').default('true').asBool();

export const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'  // Use an in-memory SQLite database
    },
    debug,
    useNullAsDefault: true
  }
};

