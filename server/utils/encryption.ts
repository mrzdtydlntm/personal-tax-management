import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // GCM recommended IV length
const AUTH_TAG_LENGTH = 16
const SEPARATOR = ':'

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length < 32) {
    throw new Error('ENCRYPTION_KEY env variable must be at least 32 characters')
  }
  // Use exactly 32 bytes for AES-256
  return Buffer.from(key.slice(0, 32), 'utf8')
}

/**
 * Encrypt a string value using AES-256-GCM.
 * Output format: iv(hex):authTag(hex):ciphertext(hex)
 */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH
  })

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(SEPARATOR)
}

/**
 * Decrypt a value encrypted by `encrypt()`.
 */
export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(SEPARATOR)
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted value format')
  }

  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH
  })
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return decrypted.toString('utf8')
}

/** Encrypt a number (stored as encrypted string in DB). */
export function encryptNumber(value: number): string {
  return encrypt(String(value))
}

/** Decrypt and return a number from an encrypted string. */
export function decryptNumber(ciphertext: string): number {
  return parseFloat(decrypt(ciphertext))
}

/** Encrypt a string that may be null/undefined. */
export function encryptNullable(value: string | null | undefined): string | null {
  if (value == null || value === '') return null
  return encrypt(value)
}

/** Decrypt a nullable encrypted string. */
export function decryptNullable(ciphertext: string | null | undefined): string | null {
  if (ciphertext == null) return null
  return decrypt(ciphertext)
}

/**
 * Decrypt a full Payslip row's sensitive fields and return plain numeric values.
 * Accepts the raw DB row (all encrypted strings) and returns an object with
 * parsed numbers for use in the application layer.
 */
export function decryptPayslip(row: {
  id: string
  userId: string
  month: number
  year: number
  grossSalary: string
  takeHomePay: string
  pph21Deducted: string
  otherDeductions: string | null
  fileUrl: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: row.id,
    userId: row.userId,
    month: row.month,
    year: row.year,
    grossSalary: decryptNumber(row.grossSalary),
    takeHomePay: decryptNumber(row.takeHomePay),
    pph21Deducted: decryptNumber(row.pph21Deducted),
    otherDeductions: row.otherDeductions ? decryptNumber(row.otherDeductions) : 0,
    fileUrl: row.fileUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
