import app from './app';
import { get } from 'env-var';
import { client } from './config/knexClient';

const PORT = get('PORT').default(7001).asIntPositive();

async function setupServer() {
  try {
    await client.migrate.latest();
    await client.seed.run();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

async function runServer() {
  await setupServer();
  app.listen(PORT, () => console.log(`ATM service has started on port ${PORT}.`));
}

void runServer();
