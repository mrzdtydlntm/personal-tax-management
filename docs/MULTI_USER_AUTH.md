# Multi-User Authentication Enhancement

## Overview

The application has been upgraded from a single-password system to a full multi-user authentication system. Each user has their own isolated data (payslips, tax settings) secured with JWT HS512 tokens and HMAC-SHA512 password hashing.

---

## What Changed

### 1. Database Schema

**New `User` model:**

```prisma
model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  password    String   // HMAC-SHA512 hashed
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  payslips    Payslip[]
  taxSettings TaxSettings?
}
```

**Updated `Payslip` model:**
- Added `userId` foreign key
- Unique constraint changed from `@@unique([month, year])` → `@@unique([userId, month, year])`
- Index changed from `@@index([year])` → `@@index([userId, year])`
- Added `onDelete: Cascade` — deleting a user removes all their payslips

**Updated `TaxSettings` model:**
- Added `userId` foreign key (one-to-one per user)
- Replaced singleton pattern with per-user settings
- Added `onDelete: Cascade`

---

### 2. Password Hashing — HMAC-SHA512

Passwords are hashed using **HMAC-SHA512** via Node.js `crypto` module.

```typescript
// server/utils/auth.ts
import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha512', HASH_SECRET)
    .update(password)
    .digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password)
  return crypto.timingSafeEqual(
    Buffer.from(inputHash, 'hex'),
    Buffer.from(hash, 'hex')
  )
}
```

**Key details:**
- Uses `HASH_SECRET` env variable as the HMAC key (falls back to `JWT_SECRET`)
- `timingSafeEqual` prevents timing-based attacks during comparison
- Digest output is a 128-character hex string

**Required environment variable:**
```env
HASH_SECRET="your-separate-hmac-secret-key-here"
```

---

### 3. JWT — HS512 Algorithm

JWT tokens are now signed with **HS512** (HMAC-SHA512) instead of the default HS256.

```typescript
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS512',   // <-- upgraded from HS256
    expiresIn: '7d'
  })
}

export function verifyToken(token: string): JWTPayload | null {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] }) as JWTPayload
}
```

**JWT Payload structure:**
```typescript
interface JWTPayload {
  userId: string
  username: string
  email: string
  iat: number   // issued at
  exp: number   // expiry (7 days)
}
```

---

### 4. New API Endpoints

#### `POST /api/auth/register`

Create a new user account.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "cm...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Validations:**
- All fields required
- Password minimum 8 characters
- Username must be unique
- Email must be unique
- Sets `auth_token` cookie on success

---

#### `POST /api/auth/login`

**Request (updated — now uses email instead of password only):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "cm...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

#### `GET /api/auth/check`

**Response (updated — now returns user info):**
```json
{
  "authenticated": true,
  "user": {
    "userId": "cm...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### 5. Data Isolation

All data endpoints now extract `userId` from the JWT token and scope all queries to that user:

```typescript
// Example: GET /api/payslips
export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)   // throws 401 if not authenticated

  const payslips = await prisma.payslip.findMany({
    where: { userId, year },   // scoped to user
    orderBy: { month: 'asc' }
  })

  return payslips
})
```

**Ownership checks on mutations:**

PUT and DELETE endpoints verify the record belongs to the authenticated user before modifying it:

```typescript
const existing = await prisma.payslip.findFirst({ where: { id, userId } })
if (!existing) {
  throw createError({ statusCode: 404, message: 'Payslip not found' })
}
```

This prevents users from accessing or modifying other users' data.

---

### 6. New Pages

#### `/register` — Registration Page
- Username, email, password, confirm password fields
- Real-time password strength indicator (Lemah / Cukup / Baik / Kuat)
- Password confirmation validation
- Show/hide password toggle
- Redirects to dashboard on success

#### `/login` — Updated Login Page
- Now accepts **email + password** (previously single password)
- Link to `/register` for new users

---

### 7. Layout — User Info in Navbar

The default layout now displays the authenticated user's avatar (initials) and username in the navigation bar, fetched from `/api/auth/check` on mount.

---

## Migration Guide

### New Installation

```bash
# 1. Add new env vars to .env
HASH_SECRET="your-separate-hmac-secret"  # add this

# 2. Run migration
pnpm prisma:migrate
# Migration name: add_user_model_multi_user
```

### Existing Installation

If you have existing data, the migration will:
1. Create the `User` table
2. Add `userId` column to `Payslip` and `TaxSettings`
3. Drop the old single-password `APP_PASSWORD` usage

> ⚠️ **Existing payslip data will need to be reassigned to a user.** The safest path is to back up your data, reset, then re-import after creating your user account.

```bash
# Backup first
pnpm prisma:studio  # export data manually

# Run migration
pnpm prisma:migrate
```

---

## Environment Variables (Updated)

```env
# Database
DATABASE_URL="postgresql://..."

# JWT (used for signing tokens — HS512)
JWT_SECRET="long-random-secret-min-64-chars"

# Password hashing key (HMAC-SHA512)
HASH_SECRET="another-separate-secret-key"

# APP_PASSWORD is no longer needed — remove it
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Security Summary

| Feature | Before | After |
|---------|--------|-------|
| Auth model | Single password | Per-user (username/email/password) |
| Password storage | Plain env var | HMAC-SHA512 hashed in database |
| JWT algorithm | HS256 | **HS512** |
| Data isolation | None | Per-user (userId scoping) |
| Ownership checks | None | Verified on all mutations |
| Timing-safe compare | No | Yes (`timingSafeEqual`) |
| Password strength | N/A | Visual indicator on register |
| Token payload | `{ authenticated }` | `{ userId, username, email }` |

---

## File Changes Summary

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `User`, updated `Payslip`/`TaxSettings` |
| `server/utils/auth.ts` | HMAC-SHA512 hashing, HS512 JWT, `requireAuth` returns user |
| `server/api/auth/login.post.ts` | Accepts email+password, queries DB |
| `server/api/auth/register.post.ts` | **New** — creates user account |
| `server/api/auth/check.get.ts` | Returns user info in response |
| `server/api/auth/logout.post.ts` | Unchanged |
| `server/api/payslips/*.ts` | All scoped to `userId` from JWT |
| `server/api/tax-settings/*.ts` | All scoped to `userId` from JWT |
| `server/api/tax/calculate.post.ts` | Scoped to `userId` from JWT |
| `server/middleware/auth.ts` | Added `/api/auth/register` to public paths |
| `middleware/auth.global.ts` | Added `/register` to public routes |
| `pages/login.vue` | Updated to email+password form |
| `pages/register.vue` | **New** — registration form |
| `layouts/default.vue` | Shows logged-in user avatar + username |
