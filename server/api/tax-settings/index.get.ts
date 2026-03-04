import prisma from '~/server/utils/prisma'
import { PTKP_VALUES } from '~/server/utils/taxCalculator'

export default defineEventHandler(async () => {
  let settings = await prisma.taxSettings.findFirst()

  if (!settings) {
    // Create default settings
    settings = await prisma.taxSettings.create({
      data: {
        ptkpStatus: 'TK/0',
        ptkpAmount: PTKP_VALUES['TK/0']
      }
    })
  }

  return settings
})
