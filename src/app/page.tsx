'use client'

import retroFont from '../components/RetroFont'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: true })

export default function Home() {
  return (
    <div className={`bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden ${retroFont.className}`}>
      <TunnelScene />
    </div>
  )
}
