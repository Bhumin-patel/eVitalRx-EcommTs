import { Pool } from 'pg';

export const pool: Pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'bhumin@259',
  port: 5432,
  max: 5
});