'use client'

import { useGLTF } from '@react-three/drei';
import dynamic from 'next/dynamic'

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: true })

export default function Home() {

  return (
    <div className="bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden">
      <TunnelScene />
    </div>
  )
}
