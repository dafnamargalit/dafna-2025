import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Merch: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      <a 
        href="https://shop.dafna.music"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="/images/merch.png"
          alt="Merch thumbnail"
          width={isMobile ? 500 : 600}
          height={isMobile ? 500 : 600}
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </a>
    </div>
  );
};

export default Merch;

