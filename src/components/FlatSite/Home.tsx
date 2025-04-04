import Link from 'next/link';
import { ChevronDown, IconGithub } from '../Icons';
import { IconYoutube } from '../Icons';
import { IconInstagram } from '../Icons';
import { IconSpotify } from '../Icons';
import { DafnaLogo } from '../Icons';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

  return (
    <div className={`absolute ${isMobile ? 'bottom-24' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-screen w-screen z-10`}>
            <Link 
              href={'https://dafna.ffm.to/badpeoplebadthings'} 
              className={`hover:opacity-70 bg-cyan-300 flex items-center justify-center ${isMobile ? 'p-1 text-sm' : 'p-2'} border-solid border-2 border-cyan-500 text-cyan-700 cursor-pointer`}
              aria-label="Pre-save Bad People Bad Things"
            >
              <i>PRE-SAVE "BADPEOPLEBADTHINGS"</i>
            </Link>
            <DafnaLogo width={isMobile ? 200 : 400} height={isMobile ? 200 : 400}/>
            <div className='flex flex-row space-x-2'>
              <a href='https://open.spotify.com/artist/6FR2ARlfDqNU7BMBaWjGZP?si=DSyNj67wTyi1A4G7JZF-0w' aria-label="Spotify" className="cursor-pointer">
                <IconSpotify />
              </a>
              <a href="https://instagram.com/dafnamusic" aria-label="Instagram" className="cursor-pointer">
                <IconInstagram />
              </a>
              <a href='https://www.youtube.com/channel/UCzPtND9EY5MkOepLzllAbiw' aria-label="YouTube" className="cursor-pointer">
                <IconYoutube />
              </a>
              <a href='https://github.com/dafnamargalit' aria-label="GitHub" className="cursor-pointer">
                <IconGithub />
              </a>
            </div>
            <button 
              className={`absolute text-cyan-300 items-center justify-center flex flex-col bottom-4 cursor-pointer`} 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label={isMobile ? 'Swipe down to explore' : 'Scroll down to explore'}
            >
              <div>{isMobile ? 'swipe down' : 'scroll down'}</div>
              <ChevronDown fill="#67E8F9"/>
            </button>
          </div>
  );
};

export default Home;
