'use client'

import { useEffect } from 'react'

export default function Tickets() {
  useEffect(() => {
    window.location.href = 'https://www.hotelcafe.com/tickets/?s=events_view&id=14653'
  }, [])

  return null
}
