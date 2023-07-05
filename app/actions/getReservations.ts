import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
  userId?: string
  authorId?: string
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params

    const query: any = {}

    if (listingId) {
      query.listingId = listingId
    }

    if (userId) {
      query.userId = userId
    }

    if (authorId) {
      query.listing = { userId: authorId }
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeReservations = reservations.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      listing: {
        ...item.listing,
        createdAt: item.listing.createdAt.toISOString(),
      },
    }))

    return safeReservations
  } catch (error: any) {
    throw new Error(error)
  }
}
