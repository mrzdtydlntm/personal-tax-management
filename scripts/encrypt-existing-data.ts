/**
 * Data migration script: encrypt existing plaintext float values in Payslip table.
 *
 * Run AFTER applying migration 20260325000001_encrypt_payslip_fields:
 *   npx prisma migrate deploy   (applies the migration that adds _float columns)
 *   npx tsx scripts/encrypt-existing-data.ts
 *
 * The script will:
 *   1. Read all rows that still have unencrypted data (grossSalary IS NULL)
 *   2. Encrypt each numeric value using AES-256-GCM
 *   3. Write encrypted values to the new TEXT columns
 *   4. Set NOT NULL constraints
 *   5. Drop the old _float columns
 *
 * Requires ENCRYPTION_KEY env variable (≥32 characters) to be set in .env
 */

import { PrismaClient } from '@prisma/client'
import { encryptNumber } from '../server/utils/encryption'

const prisma = new PrismaClient()

interface PayslipFloatRow {
  id: string
  grossSalary_float: number
  takeHomePay_float: number
  pph21Deducted_float: number
  otherDeductions_float: number
}

async function main() {
  console.log('Starting encryption migration...')

  if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
    throw new Error('ENCRYPTION_KEY env variable must be at least 32 characters')
  }

  // Read rows that still have unencrypted data
  const rows = await prisma.$queryRaw<PayslipFloatRow[]>`
    SELECT
      id,
      "grossSalary_float",
      "takeHomePay_float",
      "pph21Deducted_float",
      "otherDeductions_float"
    FROM "Payslip"
    WHERE "grossSalary" IS NULL
  `

  if (rows.length === 0) {
    console.log('No rows to encrypt. All payslips already have encrypted values.')
  } else {
    console.log(`Encrypting ${rows.length} payslip row(s)...`)

    for (const row of rows) {
      const encGross = encryptNumber(Number(row.grossSalary_float))
      const encTakeHome = encryptNumber(Number(row.takeHomePay_float))
      const encPph21 = encryptNumber(Number(row.pph21Deducted_float))
      const encOther = encryptNumber(Number(row.otherDeductions_float ?? 0))

      await prisma.$executeRaw`
        UPDATE "Payslip"
        SET
          "grossSalary"     = ${encGross},
          "takeHomePay"     = ${encTakeHome},
          "pph21Deducted"   = ${encPph21},
          "otherDeductions" = ${encOther}
        WHERE id = ${row.id}
      `
    }

    console.log(`Encrypted ${rows.length} row(s) successfully.`)
  }

  // Enforce NOT NULL now that all rows have encrypted values
  console.log('Setting NOT NULL constraints on encrypted columns...')
  await prisma.$executeRaw`ALTER TABLE "Payslip" ALTER COLUMN "grossSalary" SET NOT NULL`
  await prisma.$executeRaw`ALTER TABLE "Payslip" ALTER COLUMN "takeHomePay" SET NOT NULL`
  await prisma.$executeRaw`ALTER TABLE "Payslip" ALTER COLUMN "pph21Deducted" SET NOT NULL`
  await prisma.$executeRaw`ALTER TABLE "Payslip" ALTER COLUMN "otherDeductions" SET NOT NULL`

  // Drop old float columns — data has been encrypted into the new TEXT columns
  console.log('Dropping old float columns...')
  await prisma.$executeRaw`ALTER TABLE "Payslip" DROP COLUMN "grossSalary_float"`
  await prisma.$executeRaw`ALTER TABLE "Payslip" DROP COLUMN "takeHomePay_float"`
  await prisma.$executeRaw`ALTER TABLE "Payslip" DROP COLUMN "pph21Deducted_float"`
  await prisma.$executeRaw`ALTER TABLE "Payslip" DROP COLUMN "otherDeductions_float"`

  console.log('Migration complete. Payslip sensitive fields are now AES-256-GCM encrypted.')
}

main()
  .catch((e) => {
    console.error('Encryption migration failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
