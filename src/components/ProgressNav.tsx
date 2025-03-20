import React, { useState } from "react";
import { HamburgerMenu } from "./Icons";
import { useNavigation } from '../contexts/NavigationContext';

interface ProgressNavProps {
  isMobile: boolean;
}

const ProgressNav = ({ isMobile }: ProgressNavProps) => {
    const { checkpointIndex, setCheckpointIndex } = useNavigation();

    const pages = [
        {
            name: "home",
            index: 5,
        },
        {
            name: "music",
            index: 4,
        },
        {
            name: "videos",
            index: 3,
        },
        {
            name: "merch",
            index: 2,
        },
        {
            name: "tour",
            index: 1,
        },
        {
            name: "about",
            index: 0,
        },
    ];

    const [showPages, setShowPages] = useState(false);

    return(
        <nav 
            className={`fixed ${isMobile ? 'top-4' : 'top-1/4'} left-6 flex flex-col items-start space-y-4 z-20`}
        >
            {isMobile && (
                <button 
                    onClick={() => setShowPages(prev => !prev)}
                >
                    <HamburgerMenu isOpen={showPages} size={showPages ? '30px' : '40px'} />
                </button>
            )}
            
            {((isMobile && showPages) || (!isMobile)) && (
                <div className={`flex flex-col space-y-4 mt-2 ${isMobile ? 'bg-black/70 p-4' : ''}`}>
                    {pages.map(({ name, index }, i) => (
                        <div key={i} className="flex justify-between items-center space-x-3">
                            {/* Progress Line */}
                            <div 
                                className={`w-1 h-10 ${checkpointIndex === index ? 'bg-cyan-400' : 'bg-gray-400'}`}
                                aria-hidden="true"
                            />
                            {/* Page Link */}
                            <button 
                                onClick={() => {
                                    setCheckpointIndex(index); 
                                    setShowPages(false);
                                }}
                                aria-current={checkpointIndex === index ? "page" : undefined}
                                className={`cursor-pointer text-lg font-medium transition-colors ${
                                    checkpointIndex === index ? 'text-cyan-400 font-bold' : 'text-gray-600'
                                }`}
                            >
                                {name}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </nav>
    )
}

export default ProgressNav;