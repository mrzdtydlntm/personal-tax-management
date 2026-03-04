import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Payslip ID is required'
    })
  }

  await prisma.payslip.delete({
    where: { id }
  })

  return { success: true }
})
