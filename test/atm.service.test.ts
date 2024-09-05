import request from 'supertest';
import { knex, Knex } from 'knex';
import app from '../src/app'; // Your Express app
import { dbConfig } from '../src/config/knex';
import { ATM_TABLE_NAME, ErrorCodes } from '../src/config/consts';

let db: Knex;

beforeAll(async () => {
  db = knex(dbConfig.development);

  await db.migrate.latest();
  await db.seed.run();
});

afterEach(async () => {
  await db(ATM_TABLE_NAME).delete();
  await db.seed.run();
});

describe('ATM API Routes', () => {
  test('POST /withdraw - Success', async () => {
    const response = await request(app).post('/atm/withdraw').send({ amount: 150 });

    expect(response.status).toBe(ErrorCodes.Ok);
    expect(response.body.result).toHaveProperty('BILL');
    expect(response.body.result).toHaveProperty('COIN');
  });

  test('POST /withdraw - Not enough money', async () => {
    const response = await request(app).post('/atm/withdraw').send({ amount: 5000 });
    console.log(response);

    expect(response.status).toBe(ErrorCodes.UnprocessableEntity);
    expect(response.body.error).toBe('illegal amount, maximum allowed amount is 2000');
  });

  test('POST /refill - Success', async () => {
    const response = await request(app)
      .post('/atm/refill')
      .send({ money: { '100': 10 } });

    expect(response.status).toBe(ErrorCodes.Created);
    expect(response.text).toBe('ATM refilled successfully');
  });

  test('POST /withdraw - too much coins', async () => {
    // refill enough coins for test too much coins
    await request(app)
      .post('/atm/refill')
      .send({
        money: {
          '0.01': 50,
          '0.1': 4,
        },
      });
    const response = await request(app).post('/atm/withdraw').send({ amount: 0.99 });

    expect(response.status).toBe(ErrorCodes.UnprocessableEntity);
    expect(response.body.error).toBe('Too many coins');
  });

  test('POST /withdraw - No Enough Money', async () => {
    const response = await request(app).post('/atm/withdraw').send({ amount: 0.99 });

    expect(response.status).toBe(ErrorCodes.Conflict);
    expect(response.body.error).toBe('Not enough money available');
    expect(response.body.currentBalance).toEqual([
      {
        denomination: 200,
        count: 1,
        type: 'BILL',
      },
      {
        denomination: 100,
        count: 2,
        type: 'BILL',
      },
      {
        denomination: 20,
        count: 5,
        type: 'BILL',
      },
      {
        denomination: 10,
        count: 10,
        type: 'COIN',
      },
      {
        denomination: 5,
        count: 10,
        type: 'COIN',
      },
      {
        denomination: 1,
        count: 10,
        type: 'COIN',
      },
      {
        denomination: 0.1,
        count: 1,
        type: 'COIN',
      },
      {
        denomination: 0.01,
        count: 10,
        type: 'COIN',
      },
    ]);
  });
});
