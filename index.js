const express = require('express');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it under Variables and redeploy.');
  process.exit(1);
}

// Inside Naijacloud's private network the database needs no TLS.
// For an external TLS endpoint, set PGSSLMODE=require.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
});

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ service: 'nc-express-postgres-sample', endpoints: ['/health', '/notes'] });
});

app.get('/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('select version() as version, now() as now');
    res.json({ status: 'ok', db: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/notes', async (_req, res) => {
  const { rows } = await pool.query('select id, body, created_at from notes order by id');
  res.json(rows);
});

app.post('/notes', async (req, res) => {
  const body = String(req.body?.body ?? '').trim();
  if (!body) return res.status(400).json({ message: 'body is required' });
  const { rows } = await pool.query(
    'insert into notes (body) values ($1) returning id, body, created_at',
    [body],
  );
  res.status(201).json(rows[0]);
});

async function main() {
  await pool.query(
    'create table if not exists notes (id serial primary key, body text not null, created_at timestamptz not null default now())',
  );
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => console.log(`listening on ${port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
