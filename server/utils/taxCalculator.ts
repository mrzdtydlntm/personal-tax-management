/**
 * Indonesian PPh21 Tax Calculator
 * Based on 2024 tax regulations
 */

// PTKP (Penghasilan Tidak Kena Pajak) 2024
export const PTKP_VALUES = {
  'TK/0': 54000000,   // Tidak Kawin, 0 tanggungan
  'TK/1': 58500000,   // Tidak Kawin, 1 tanggungan
  'TK/2': 63000000,   // Tidak Kawin, 2 tanggungan
  'TK/3': 67500000,   // Tidak Kawin, 3 tanggungan
  'K/0': 58500000,    // Kawin, 0 tanggungan
  'K/1': 63000000,    // Kawin, 1 tanggungan
  'K/2': 67500000,    // Kawin, 2 tanggungan
  'K/3': 72000000,    // Kawin, 3 tanggungan
}

// Tax brackets for 2024 (annual income)
export const TAX_BRACKETS = [
  { max: 60000000, rate: 0.05 },      // 0 - 60 juta: 5%
  { max: 250000000, rate: 0.15 },     // 60 - 250 juta: 15%
  { max: 500000000, rate: 0.25 },     // 250 - 500 juta: 25%
  { max: 5000000000, rate: 0.30 },    // 500 juta - 5 miliar: 30%
  { max: Infinity, rate: 0.35 },      // > 5 miliar: 35%
]

/**
 * Calculate annual tax based on progressive rates
 */
export function calculateProgressiveTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0

  let tax = 0
  let previousBracket = 0

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= previousBracket) break

    const incomeInBracket = Math.min(taxableIncome, bracket.max) - previousBracket
    tax += incomeInBracket * bracket.rate
    previousBracket = bracket.max

    if (taxableIncome <= bracket.max) break
  }

  return Math.round(tax)
}

/**
 * Calculate annual tax liability and comparison
 */
export function calculateAnnualTax(
  annualGrossIncome: number,
  ptkpStatus: keyof typeof PTKP_VALUES = 'TK/0',
  totalPph21Deducted: number
) {
  const ptkpAmount = PTKP_VALUES[ptkpStatus]
  const taxableIncome = Math.max(0, annualGrossIncome - ptkpAmount)
  const actualTaxLiability = calculateProgressiveTax(taxableIncome)

  // Positive means refund, negative means additional payment needed
  const difference = totalPph21Deducted - actualTaxLiability

  return {
    annualGrossIncome,
    ptkpAmount,
    ptkpStatus,
    taxableIncome,
    actualTaxLiability,
    totalPph21Deducted,
    difference,
    status: difference > 0 ? 'REFUND' : difference < 0 ? 'ADDITIONAL_PAYMENT' : 'EXACT',
    effectiveTaxRate: annualGrossIncome > 0 ? (actualTaxLiability / annualGrossIncome) * 100 : 0,
  }
}

/**
 * Get tax bracket information for an income
 */
export function getTaxBracketInfo(annualIncome: number) {
  let bracket = 1
  let previousMax = 0

  for (const [index, b] of TAX_BRACKETS.entries()) {
    if (annualIncome <= b.max) {
      bracket = index + 1
      break
    }
    previousMax = b.max
  }

  return {
    bracket,
    rate: TAX_BRACKETS[bracket - 1].rate,
    rangeStart: previousMax,
    rangeEnd: TAX_BRACKETS[bracket - 1].max,
  }
}

/**
 * Calculate monthly projection based on current data
 */
export function calculateMonthlyProjection(
  currentMonthData: Array<{ grossSalary: number; pph21Deducted: number }>,
  currentMonth: number
) {
  const totalGross = currentMonthData.reduce((sum, m) => sum + m.grossSalary, 0)
  const totalPph21 = currentMonthData.reduce((sum, m) => sum + m.pph21Deducted, 0)
  const avgMonthlyGross = totalGross / currentMonthData.length
  const avgMonthlyPph21 = totalPph21 / currentMonthData.length

  const remainingMonths = 12 - currentMonth
  const projectedAnnualGross = totalGross + (avgMonthlyGross * remainingMonths)
  const projectedAnnualPph21 = totalPph21 + (avgMonthlyPph21 * remainingMonths)

  return {
    projectedAnnualGross,
    projectedAnnualPph21,
    avgMonthlyGross,
    avgMonthlyPph21,
    remainingMonths,
  }
}
