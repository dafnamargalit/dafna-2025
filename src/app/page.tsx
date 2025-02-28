'use client'

import dynamic from 'next/dynamic'

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: false })

export default function Home() {
  return (
    <div className="bg-black w-screen h-screen overflow-hidden">
      <TunnelScene />
    </div>
  )
}
