const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function init() {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS visits (id SERIAL PRIMARY KEY, visited_at TIMESTAMP DEFAULT NOW())'
  );
}

app.get('/', async (req, res) => {
  await pool.query('INSERT INTO visits DEFAULT VALUES');
  const { rows } = await pool.query('SELECT COUNT(*) FROM visits');
  res.json({ message: 'Hello from Compose!', visits: Number(rows[0].count) });
});

init().then(() => app.listen(3000, () => console.log('Listening on 3000')));
