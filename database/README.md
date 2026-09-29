# StoreTrae Database (PostgreSQL)

## Connection String (Default)
```
Host=localhost;Port=5432;Database=storetrae;Username=postgres;Password=postgres
```

## Quick Start (Docker)

> **Modern Docker (v2+):** Use `docker compose` (with a **space**, not hyphen).
> Legacy Docker Compose v1: `docker-compose` (hyphenated). Try the first command if in doubt.

```bash
cd database

# Option A: Modern Docker (Docker Desktop 2022+, Docker Compose V2 plugin)
docker compose up -d

# Option B: Legacy V1 (standalone docker-compose binary)
docker-compose up -d
```

This spins up PostgreSQL 16 on port 5432 and:
- Auto-creates the `storetrae` database
- Creates user `postgres` / password `postgres`
- Runs the schema & seed data from `docker-entrypoint-initdb.d/`

### Verify it's running
```bash
docker compose ps
# or: docker-compose ps
```

### Stop the database
```bash
docker compose down
# To fully wipe data volume too: docker compose down -v
```

### Troubleshooting
- **Command not found?** Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/). It includes `docker compose` V2 by default.
- **Port 5432 in use?** You may have a local PostgreSQL installed. Stop it first or change the port mapping in `docker-compose.yml` (e.g., `"5433:5432"`).
- **No Docker at all?** Use the Manual Setup below instead.

## Manual Setup (Existing PostgreSQL / No Docker)

Run in order via `psql`, **pgAdmin**, or your favorite SQL client:

### Step 1: Create database
```sql
CREATE DATABASE storetrae WITH ENCODING = 'UTF8';
```

### Step 2: Run the full setup script
In your SQL client connected to the **storetrae** database:
```sql
\i 'c:/Users/yohan/Desktop/store-trae/database/setup.sql'
```
Or open `database/setup.sql` and execute the entire file.

Or run individually:
1. `schema/001_init_schema.sql` — Tables, enums, triggers, indexes
2. `seeds/001_seed_data.sql` — Admin user
3. Add products and orders through the admin UI after setup
4. `seeds/003_views.sql` — Dashboard/reporting views

## Default Admin Credentials

| Field    | Value         |
|----------|---------------|
| Username | `admin`       |
| Password | `admin123`    |

Password is hashed with BCrypt (work factor 10). To generate a new hash:
```sql
-- Requires pgcrypto extension, or use the .NET tooling
-- $2a$10$... = 'admin123'
```

## Tables

| Table         | Description                                              |
|---------------|----------------------------------------------------------|
| `users`       | Admin accounts (future customer accounts)                |
| `products`    | Shared product catalog visible to all customers          |
| `orders`      | Checked-out orders with customer + shipping info         |
| `order_items` | Line items per order (product snapshot at purchase)      |

## Future Payment Integration (Telebirr / Chapa)

Columns already added to `orders`:
- `payment_method` - e.g., `telebirr`, `chapa`, `cod`
- `payment_reference` - our internal reference
- `payment_transaction_id` - provider TXN ID
- `payment_status` - `unpaid`, `pending`, `paid`, `failed`
- `payment_details` - JSONB for raw provider response

## Useful Queries

```sql
-- Sales by month
SELECT * FROM v_monthly_sales;

-- Top products
SELECT * FROM v_top_products LIMIT 10;

-- Low stock alerts
SELECT * FROM v_low_stock;

-- Recent orders summary
SELECT * FROM v_order_summary LIMIT 20;
```
