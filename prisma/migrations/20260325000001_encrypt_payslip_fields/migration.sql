-- Rename existing float columns to temporary _float suffix
-- These will be read by the encrypt-existing-data script, then dropped
ALTER TABLE "Payslip" RENAME COLUMN "grossSalary" TO "grossSalary_float";
ALTER TABLE "Payslip" RENAME COLUMN "takeHomePay" TO "takeHomePay_float";
ALTER TABLE "Payslip" RENAME COLUMN "pph21Deducted" TO "pph21Deducted_float";
ALTER TABLE "Payslip" RENAME COLUMN "otherDeductions" TO "otherDeductions_float";

-- Add new TEXT columns for AES-256-GCM encrypted values (nullable initially)
ALTER TABLE "Payslip" ADD COLUMN "grossSalary" TEXT;
ALTER TABLE "Payslip" ADD COLUMN "takeHomePay" TEXT;
ALTER TABLE "Payslip" ADD COLUMN "pph21Deducted" TEXT;
ALTER TABLE "Payslip" ADD COLUMN "otherDeductions" TEXT;
