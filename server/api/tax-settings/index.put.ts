import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { PTKP_VALUES } from '~/server/utils/taxCalculator'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { ptkpStatus } = body

  if (!ptkpStatus || !PTKP_VALUES[ptkpStatus as keyof typeof PTKP_VALUES]) {
    throw createError({ statusCode: 400, message: 'Invalid PTKP status' })
  }

  const ptkpAmount = PTKP_VALUES[ptkpStatus as keyof typeof PTKP_VALUES]

  const settings = await prisma.taxSettings.upsert({
    where: { userId },
    update: { ptkpStatus, ptkpAmount },
    create: { userId, ptkpStatus, ptkpAmount }
  })

  return settings
})
