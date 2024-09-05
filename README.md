# ATM Machine Backend

A TypeScript-based backend for handling ATM withdrawals with optimized bill and coin distribution.

# Features

Prioritize bills over coins.
Error handling for invalid amounts and excessive coins.
APIs for withdrawal, refill, and health check.

## Tech Stack

TypeScript, Express, Knex.js, SQLite (In-Memory), ESLINT

### Copy code

```bash

git clone https://github.com/walidBarakeh/atm-backend.git
cd atm-backend
```

## Setup

```bash

# use the project node version
nvm use
# Install dependencies
npm install

# run tests
npm run test

# run service
npm run start:dev

```

## API Endpoints

POST /atm/withdraw: Withdraws amount with bill preference.

POST /atm/refill: Adds bills/coins to ATM.

GET /atm/balance: return current atm balance.

GET /is_alive: Server health check.
