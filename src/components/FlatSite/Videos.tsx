import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Videos: React.FC = () => {
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
        href="https://www.youtube.com/channel/UCzPtND9EY5MkOepLzllAbiw"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="/images/videos.png"
          alt="Videos thumbnail"
          width={isMobile ? 250 : 400}
          height={isMobile ? 250 : 400}
          className={`transition-transform duration-300 mb-10 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </a>
    </div>
  );
};

export default Videos;

