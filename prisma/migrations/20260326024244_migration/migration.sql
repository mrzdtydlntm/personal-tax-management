/*
  Warnings:

  - You are about to drop the column `grossSalary_float` on the `Payslip` table. All the data in the column will be lost.
  - You are about to drop the column `otherDeductions_float` on the `Payslip` table. All the data in the column will be lost.
  - You are about to drop the column `pph21Deducted_float` on the `Payslip` table. All the data in the column will be lost.
  - You are about to drop the column `takeHomePay_float` on the `Payslip` table. All the data in the column will be lost.
  - Made the column `grossSalary` on table `Payslip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `takeHomePay` on table `Payslip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pph21Deducted` on table `Payslip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `otherDeductions` on table `Payslip` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Payslip_month_year_key";

-- AlterTable
ALTER TABLE "Payslip" DROP COLUMN "grossSalary_float",
DROP COLUMN "otherDeductions_float",
DROP COLUMN "pph21Deducted_float",
DROP COLUMN "takeHomePay_float",
ALTER COLUMN "grossSalary" SET NOT NULL,
ALTER COLUMN "takeHomePay" SET NOT NULL,
ALTER COLUMN "pph21Deducted" SET NOT NULL,
ALTER COLUMN "otherDeductions" SET NOT NULL;
