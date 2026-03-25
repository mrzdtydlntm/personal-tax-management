# Field-Level Encryption

## Overview

Sensitive financial fields in the `Payslip` table are encrypted at rest using **AES-256-GCM**. Even if an attacker gains read access to the raw database (e.g., via a SQL viewer or a leaked backup), all salary and tax figures appear as opaque ciphertext strings.

---

## Encrypted Fields

| Table | Column | Type in DB | Description |
|-------|--------|-----------|-------------|
| `Payslip` | `grossSalary` | `TEXT` | Gaji bruto |
| `Payslip` | `takeHomePay` | `TEXT` | Gaji bersih |
| `Payslip` | `pph21Deducted` | `TEXT` | PPh21 yang dipotong |
| `Payslip` | `otherDeductions` | `TEXT` | Potongan lain (BPJS, etc) |
| `Payslip` | `fileUrl` | `TEXT?` | URL ke file slip gaji |

Non-sensitive fields (`id`, `userId`, `month`, `year`, `createdAt`, `updatedAt`) are stored in plaintext.

---

## Algorithm

**AES-256-GCM** (Authenticated Encryption with Associated Data)

| Parameter | Value |
|-----------|-------|
| Algorithm | `aes-256-gcm` |
| Key length | 256 bits (32 bytes) |
| IV length | 96 bits (12 bytes) — GCM recommended |
| Auth tag length | 128 bits (16 bytes) |
| Encoding | Hex |

### Ciphertext Format

Each encrypted value is stored as a colon-separated hex string:

```
<iv_hex>:<auth_tag_hex>:<ciphertext_hex>
```

Example (32 chars IV + 32 chars tag + variable ciphertext):
```
a3f2c1...:<auth_tag>:<ciphertext>
```

- **IV** is randomly generated per encryption call — identical plaintext values produce different ciphertext
- **Auth tag** ensures integrity; decryption will throw if tampered
- **Ciphertext** is the AES-GCM encrypted number (stored as its string representation)

---

## Implementation

### `server/utils/encryption.ts`

```typescript
import crypto from 'crypto'

// Key must be ≥32 chars; only first 32 bytes are used for AES-256
function getKey(): Buffer { ... }

export function encrypt(plaintext: string): string { ... }   // iv:tag:cipher
export function decrypt(ciphertext: string): string { ... }

export function encryptNumber(value: number): string        // encrypt(String(value))
export function decryptNumber(ciphertext: string): number   // parseFloat(decrypt(ciphertext))

export function encryptNullable(value: string | null): string | null
export function decryptNullable(ciphertext: string | null): string | null

export function decryptPayslip(row: { ... }): { /* plain numbers */ }
```

### Usage in API routes

**On write (POST / PUT):**
```typescript
import { encryptNumber, encryptNullable } from '~/server/utils/encryption'

grossSalary:     encryptNumber(parseFloat(body.grossSalary)),
pph21Deducted:   encryptNumber(parseFloat(body.pph21Deducted)),
fileUrl:         encryptNullable(body.fileUrl),
```

**On read (GET):**
```typescript
import { decryptPayslip } from '~/server/utils/encryption'

const rows = await prisma.payslip.findMany({ ... })
return rows.map(decryptPayslip)   // returns plain { grossSalary: number, ... }
```

---

## Key Management

### Environment Variable

```env
ENCRYPTION_KEY="your-32-plus-character-encryption-key"
```

- Must be **at least 32 characters** long
- Only the first 32 bytes are used (UTF-8) as the AES-256 key
- Keep it **separate** from `JWT_SECRET` and `HASH_SECRET`
- **Never commit this to source control**

### Generating a secure key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This produces a 64-character hex string (256 bits of entropy), well above the 32-character minimum.

### Key rotation

Currently there is no built-in key rotation. To rotate:
1. Add a new `ENCRYPTION_KEY_NEW` env var
2. Write a script similar to `scripts/encrypt-existing-data.ts` that decrypts with the old key and re-encrypts with the new one
3. Swap `ENCRYPTION_KEY` to the new value and redeploy

---

## Migration Guide

### Fresh Installation

```bash
# 1. Add env var to .env
ENCRYPTION_KEY="your-32-plus-character-encryption-key"

# 2. Apply migration (adds new TEXT columns alongside old float columns)
pnpm prisma:migrate

# 3. Run encrypt script (no existing rows to migrate — exits immediately)
npx tsx scripts/encrypt-existing-data.ts
```

### Existing Installation (has data)

If you already have payslip rows stored as plain floats:

```bash
# 1. Add env var
ENCRYPTION_KEY="your-32-plus-character-encryption-key"

# 2. Apply migration 20260325000001_encrypt_payslip_fields
#    This renames old float columns to _float suffix and adds new TEXT columns
pnpm prisma:migrate

# 3. Run the encryption script
#    Reads _float columns → encrypts → writes to TEXT columns → drops _float columns
npx tsx scripts/encrypt-existing-data.ts
```

The script is idempotent: it only processes rows where `grossSalary IS NULL` (not yet encrypted), so re-running it after partial failure is safe.

---

## Security Properties

| Property | Detail |
|----------|--------|
| Confidentiality | AES-256 — computationally infeasible to brute force |
| Integrity | GCM auth tag — any tampering causes decryption to throw |
| IV uniqueness | 96-bit random IV per value — prevents ciphertext comparison attacks |
| Key separation | Separate from JWT secret and password hash secret |
| No plaintext leakage | Float columns are dropped after migration; no fallback path |

---

## File Changes Summary

| File | Change |
|------|--------|
| `server/utils/encryption.ts` | New — AES-256-GCM encrypt/decrypt utilities |
| `prisma/schema.prisma` | `grossSalary`, `takeHomePay`, `pph21Deducted`, `otherDeductions` → `String` |
| `prisma/migrations/20260325000001_encrypt_payslip_fields/migration.sql` | Renames float columns, adds TEXT columns |
| `scripts/encrypt-existing-data.ts` | One-time data migration script |
| `server/api/payslips/index.get.ts` | Decrypts rows on read |
| `server/api/payslips/index.post.ts` | Encrypts values on create |
| `server/api/payslips/[id].put.ts` | Encrypts values on update |
| `server/api/tax/calculate.post.ts` | Decrypts rows before tax calculation |
| `.env.example` | Added `ENCRYPTION_KEY` |
