'use client'

import retroFont from '../components/RetroFont'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import FlatSite from '../components/FlatSite/FlatSite'

const TunnelScene = dynamic(() => import('../components/TunnelScene'), { ssr: true })

export default function Home() {
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    // Check user preference from localStorage
    const preferredView = localStorage.getItem('preferredView');
    setIs3D(preferredView !== '2d');
  }, []);

  return (
    
    <div className={`bg-black ${is3D ? 'overscroll-none overflow-y-none' : ''} flex justify-center items-center ${retroFont.className}`}>
      <div className="fixed top-4 right-4 z-50">
        <button
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            is3D ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          onClick={() => {
            setIs3D(!is3D);
            localStorage.setItem('preferredView', is3D ? '2d' : '3d');
          }}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
              is3D ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-white text-sm ml-2">{is3D ? '3D' : '2D'}</span>
      </div>
      {is3D ? <TunnelScene /> : <FlatSite />}
    </div>
  )
}
