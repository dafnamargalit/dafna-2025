'use client'

import { useGLTF } from '@react-three/drei';
import dynamic from 'next/dynamic'

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: true })

export default function Home() {

    useGLTF.preload('/models/paradox.glb');
    useGLTF.preload('/models/wiwwy.glb');
    useGLTF.preload('/models/ily.glb');
    useGLTF.preload('/models/submerge.glb');
    useGLTF.preload('/models/tourbus.glb');
    useGLTF.preload('/models/recordplayer.glb');
    useGLTF.preload('/models/tshirts.glb');
  return (
    <div className="bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden">
      <TunnelScene />
    </div>
  )
}
