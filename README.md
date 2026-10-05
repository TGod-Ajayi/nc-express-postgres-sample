# nc-express-postgres-sample

A minimal Express API that stores notes in PostgreSQL, ready to deploy on [Naijacloud](https://naijacloud.com).

| Route | What it does |
|---|---|
| `GET /` | Lists the endpoints |
| `GET /health` | Runs `select version()` against the database |
| `GET /notes` | Lists notes |
| `POST /notes` | Adds a note: `{"body": "hello"}` |

The `notes` table is created on start-up.

## Configuration

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Copy the internal connection string from your Naijacloud database |
| `PORT` | no | Set by Naijacloud; defaults to 3000 locally |
| `PGSSLMODE` | no | Set to `require` when connecting over a public TLS endpoint |

## Run locally

```sh
npm install
DATABASE_URL=postgres://user:pass@localhost:5432/db npm start
```

## Deploy on Naijacloud

1. Create a PostgreSQL database in your project and copy its internal connection string.
2. **New service → Web service → Public repo**, URL `https://github.com/TGod-Ajayi/nc-express-postgres-sample`, branch `main`.
3. Add a variable `DATABASE_URL` with the connection string, then **Create web service**.
4. Open `https://<your-service>.naijacloud.app/health`.
