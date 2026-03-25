-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: User unique constraints
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");

-- Insert a default system user to own all existing data.
-- Password is a placeholder hash — the real owner should change it after login.
INSERT INTO "User" ("id", "username", "email", "password", "createdAt", "updatedAt")
VALUES (
    'default-migration-user',
    'admin',
    'admin@pph21.local',
    'CHANGE_ME_ON_FIRST_LOGIN',
    NOW(),
    NOW()
);

-- Add userId to Payslip as nullable first (to avoid NOT NULL violation on existing rows)
ALTER TABLE "Payslip" ADD COLUMN "userId" TEXT;

-- Assign all existing payslips to the default user
UPDATE "Payslip" SET "userId" = 'default-migration-user' WHERE "userId" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "Payslip" ALTER COLUMN "userId" SET NOT NULL;

-- Drop old unique constraint and add new per-user one
ALTER TABLE "Payslip" DROP CONSTRAINT IF EXISTS "Payslip_month_year_key";
CREATE UNIQUE INDEX "Payslip_userId_month_year_key" ON "Payslip"("userId", "month", "year");

-- Drop old index and add new per-user one
DROP INDEX IF EXISTS "Payslip_year_idx";
CREATE INDEX "Payslip_userId_year_idx" ON "Payslip"("userId", "year");

-- Add userId to TaxSettings as nullable first
ALTER TABLE "TaxSettings" ADD COLUMN "userId" TEXT;

-- Assign all existing tax settings to the default user
UPDATE "TaxSettings" SET "userId" = 'default-migration-user' WHERE "userId" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "TaxSettings" ALTER COLUMN "userId" SET NOT NULL;

-- Drop old primary key behaviour (singleton) and add per-user unique
CREATE UNIQUE INDEX "TaxSettings_userId_key" ON "TaxSettings"("userId");

-- AddForeignKey: Payslip.userId -> User.id
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: TaxSettings.userId -> User.id
ALTER TABLE "TaxSettings" ADD CONSTRAINT "TaxSettings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
