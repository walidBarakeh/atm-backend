import { get } from 'env-var';
import { Knex } from 'knex';



const debug = get('DEBUG').default('false').asBool();

export const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './mydb.sqlite'  // Use an in-memory SQLite database
    },
    debug,
    useNullAsDefault: true
  }
};

