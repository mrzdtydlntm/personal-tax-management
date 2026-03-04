-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "takeHomePay" DOUBLE PRECISION NOT NULL,
    "pph21Deducted" DOUBLE PRECISION NOT NULL,
    "otherDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxSettings" (
    "id" TEXT NOT NULL,
    "ptkpStatus" TEXT NOT NULL DEFAULT 'TK/0',
    "ptkpAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payslip_year_idx" ON "Payslip"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_month_year_key" ON "Payslip"("month", "year");
