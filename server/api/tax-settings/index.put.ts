import prisma from '~/server/utils/prisma'
import { PTKP_VALUES } from '~/server/utils/taxCalculator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ptkpStatus } = body

  if (!ptkpStatus || !PTKP_VALUES[ptkpStatus as keyof typeof PTKP_VALUES]) {
    throw createError({
      statusCode: 400,
      message: 'Invalid PTKP status'
    })
  }

  const ptkpAmount = PTKP_VALUES[ptkpStatus as keyof typeof PTKP_VALUES]

  // Get or create settings
  let settings = await prisma.taxSettings.findFirst()

  if (!settings) {
    settings = await prisma.taxSettings.create({
      data: {
        ptkpStatus,
        ptkpAmount
      }
    })
  } else {
    settings = await prisma.taxSettings.update({
      where: { id: settings.id },
      data: {
        ptkpStatus,
        ptkpAmount
      }
    })
  }

  return settings
})
