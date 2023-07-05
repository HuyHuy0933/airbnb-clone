'use client'
import React, { useCallback, useState } from 'react'
import { SafeListing, SafeReservation, SafeUser } from '../types'
import Container from '../components/Container'
import Heading from '../components/Heading'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { error } from 'console'
import ListingCard from '../components/listings/ListingCard'

interface TripsClientProps {
  listings: SafeListing[]
  currentUser: SafeUser | null
}

const PropertiesClient: React.FC<TripsClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onDelete = useCallback((id: string) => {
    setDeletingId(id)

    axios
      .delete(`/api/listings/${id}`)
      .then(() => {
        toast.success('Listing deleted!')
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
        {listings.map((item) => (
          <ListingCard
            key={item.id}
            data={item}
            currentUser={currentUser}
            disabled={deletingId === item.id}
            actionId={item.id}
            actionLabel='Delete properpty'
            onAction={onDelete}
          />
        ))}
      </div>
    </Container>
  )
}

export default PropertiesClient
