import React, { useEffect, useState } from "react";
import { HamburgerMenu, IconAppleMusic, IconSpotify, IconTidal, IconYoutube } from "./Icons";

interface ProgressNavProps {
  checkpointIndex: number;
  setCheckpointIndex: (checkpoint: number) => void;
  isMobile: boolean;
}

const ProgressNav = ({ checkpointIndex, setCheckpointIndex, isMobile }: ProgressNavProps) => {

    const pages = [
        {
            name: "home",
            index: 6,
        },
        {
            name: "music",
            index: 5,
        },
        {
            name: "videos",
            index: 4,
        },
        {
            name: "merch",
            index: 3,
        },
        {
            name: "tour",
            index: 2,
        },
        {
            name: "about",
            index: 1,
        },
        {
            name: "new",
            index: 0,
        },
    ];

    const [showPages, setShowPages] = useState(false);

    return(
        <div className={`fixed ${isMobile ? 'top-4' : 'top-1/4'} left-6 flex flex-col items-start space-y-4 z-20`}>
        {isMobile && <button onClick={() => setShowPages(prev => !prev)}><HamburgerMenu isOpen={showPages} size={showPages ? '30px' : '40px'} /></button>}
        {((isMobile && showPages) || (!isMobile)) && pages.map(({ name, index }, i) => (
          <div key={i} className="flex justify-between items-center space-x-3">
            {/* Progress Line */}
            <div className={`w-1 h-10 ${checkpointIndex === index ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
            {/* Page Link */}
            <button onClick={() => {setCheckpointIndex(index); setShowPages(false);}}>
              <span
                className={`cursor-pointer text-lg font-medium transition-colors ${
                  checkpointIndex === index ? 'text-cyan-400 font-bold' : 'text-gray-600'
                }`}
              >
                {name}
              </span>
            </button>
          </div>
        ))}
      </div>
    )
    }

export default ProgressNav;