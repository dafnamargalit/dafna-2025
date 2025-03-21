'use client'

import SongQuiz from '@/components/SongQuiz';
import retroFont from '../../components/RetroFont'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';


const TubeScene = dynamic(() => import('../../components/TubeScene'), { ssr: true })

export default function Quiz() {
  return (
    <div className={`bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden ${retroFont.className}`}>
      <SongQuiz />
    </div>
  )
}
