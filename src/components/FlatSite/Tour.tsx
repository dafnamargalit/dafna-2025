import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TourDates from '../TourDates';

const Tour: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTourDates, setShowTourDates] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className="cursor-pointer transition-transform duration-300"
        onClick={() => setShowTourDates(!showTourDates)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="/images/tourbus.png"
          alt="Tour thumbnail"
          width={isMobile ? 700 : 800}
          height={isMobile ? 700 : 800}
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {showTourDates && <TourDates isMobile={isMobile} closeModal={() => setShowTourDates(false)} />}
    </div>
  );
};

export default Tour;
