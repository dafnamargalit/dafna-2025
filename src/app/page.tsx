'use client'

import retroFont from '../components/RetroFont'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: true })

export default function Home() {

  const [onPageLoad, setOnPageLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  return (
    <div className={`bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden ${retroFont.className}`}>
          {!onPageLoad && <div className="absolute z-40 w-screen h-screen bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden">
              {loading ? <div className='text-cyan-300'>preparing vortex...</div> : <button onClick={() => setOnPageLoad(true)} className='hover:opacity-70 bg-cyan-300 w-30 flex items-center justify-center p-2 border-solid border-2 border-cyan-500 text-cyan-700'>
              ENTER THE VORTEX
              </button>}
          </div>}
      <TunnelScene onPageLoad={onPageLoad} />
    </div>
  )
}
