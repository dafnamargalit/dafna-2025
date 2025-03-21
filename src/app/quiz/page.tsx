'use client'

import retroFont from '../../components/RetroFont'
import dynamic from 'next/dynamic'

const SongQuiz = dynamic(() => import('../../components/SongQuiz'), { ssr: true })

export default function Quiz() {
  return (
    <div className={`bg-black overscroll-none overflow-y-none flex justify-center items-center overflow-hidden ${retroFont.className}`}>
      <SongQuiz />
    </div>
  )
}
