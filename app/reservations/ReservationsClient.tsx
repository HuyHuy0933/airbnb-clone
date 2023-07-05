'use client'
import React, { useCallback, useState } from 'react'
import { SafeReservation, SafeUser } from '../types'
import Container from '../components/Container'
import Heading from '../components/Heading'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ListingCard from '../components/listings/ListingCard'

interface ReservationsClientProps {
  reservations: SafeReservation[]
  currentUser: SafeUser | null
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel = useCallback((id: string) => {
    setDeletingId(id)

    axios
      .delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success('Reservation cancelled!')
        router.refresh()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error)
      })
      .finally(() => {
        setDeletingId('')
      })
  }, [router])

  return (
    <Container>
      <Heading
        title="Reservations"
        subTitle="Bookings on your porperties"
      />

      <div
        className="
          mt-10
          grid
          grid-cols-1
          gap-8
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        {reservations.map((item) => (
          <ListingCard
            key={item.id}
            data={item.listing}
            reservation={item}
            actionId={item.id}
            disabled={deletingId === item.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
            onAction={onCancel}
          />
        ))}
      </div>
    </Container>
  )
}

export default ReservationsClient
