import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { PTKP_VALUES } from '~/server/utils/taxCalculator'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  let settings = await prisma.taxSettings.findUnique({ where: { userId } })

  if (!settings) {
    settings = await prisma.taxSettings.create({
      data: {
        userId,
        ptkpStatus: 'TK/0',
        ptkpAmount: PTKP_VALUES['TK/0']
      }
    })
  }

  return settings
})
