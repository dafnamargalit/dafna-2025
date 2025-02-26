'use client'

import dynamic from 'next/dynamic'
import { NextPage } from 'next'
import Image from "next/image";
import { AnimatePresence } from 'framer-motion';

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: false })

export default function Home() {
  return (
    <div className='relative flex items-center justify-center w-screen h-screen'>
    <div className="absolute bg-black w-screen h-screen z-10">
    <AnimatePresence mode="wait" initial={false}>
      <TunnelScene />
    </AnimatePresence>
    </div>
    </div>
  );
}
