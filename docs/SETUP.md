# Quick Setup Guide

## Prerequisites

Make sure you have:

- Node.js v24.13.0 installed via nvm
- pnpm installed globally
- PostgreSQL database (NeonDB or local)

## Step-by-Step Setup

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your database connection string:

For **NeonDB**:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

For **Local PostgreSQL**:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pph21_tax_db"
```

### 2. Database Migration

Run the following commands to set up your database:

```bash
# Generate Prisma Client
pnpm prisma generate

# Create and apply migrations
pnpm prisma:migrate
```

When prompted for migration name, enter something like: `init`

### 3. (Optional) Approve Build Scripts

If you see warnings about build scripts, approve them:

```bash
pnpm approve-builds
```

Select all packages (especially @prisma/client, @prisma/engines, prisma) using spacebar, then press Enter.

### 4. Start Development Server

```bash
# Make sure you're using the correct Node version
nvm use v24.13.0

# Start the dev server
pnpm dev
```

The application will be available at: **http://localhost:3000**

## Quick Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Database
pnpm prisma:migrate         # Run migrations
pnpm prisma:studio          # Open Prisma Studio GUI
pnpm prisma generate        # Regenerate Prisma Client

# Prisma Studio
pnpm prisma:studio          # View and edit database visually
```

## Common Issues

### Issue: "Environment variable not found: DATABASE_URL"

**Solution**: Make sure you created the `.env` file with DATABASE_URL

### Issue: Prisma migration fails

**Solution**:

1. Check your DATABASE_URL is correct
2. Make sure PostgreSQL is running
3. Ensure the database exists and is accessible

### Issue: Port 3000 already in use

**Solution**: Kill the process using port 3000 or change the port:

```bash
PORT=3001 pnpm dev
```

## First Time Usage

1. Go to **Settings** page
2. Configure your PTKP status (default is TK/0)
3. Go to **Payslips** page
4. Add your first payslip data
5. Go to **Dashboard** to see your tax calculation

## Database Reset (Development Only)

If you need to reset your database:

```bash
# Delete all data
pnpm prisma migrate reset

# This will:
# 1. Drop the database
# 2. Recreate it
# 3. Run all migrations
# 4. Seed (if seed script exists)
```

## Production Deployment

See the main README.md for detailed deployment instructions to:

- Vercel
- Netlify
- Railway
- Other platforms

Happy tracking! 🎉
