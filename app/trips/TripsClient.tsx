'use client'
import React, { useCallback, useState } from 'react'
import { SafeReservation, SafeUser } from '../types'
import Container from '../components/Container'
import Heading from '../components/Heading'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { error } from 'console'
import ListingCard from '../components/listings/ListingCard'

interface TripsClientProps {
  reservations: SafeReservation[]
  currentUser: SafeUser | null
}

const TripsClient: React.FC<TripsClientProps> = ({
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
        title="Trips"
        subTitle="Where you've been and wher you're going?"
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
            actionLabel="Cancel reservation"
            currentUser={currentUser}
            onAction={onCancel}
          />
        ))}
      </div>
    </Container>
  )
}

export default TripsClient
