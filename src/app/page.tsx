'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import FloatingModel from '@/components/FloatingTVModel'
import TunnelScene from '@/components/TunnelScene'

export default function Home() {
  return (
    <div className="bg-black w-screen h-screen overflow-hidden">
      <TunnelScene />
    </div>
  )
}
