'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { DafnaLogo, IconAppleMusic, IconSpotify, IconTidal, IconYoutube } from '@/components/Icons';
import { useParams } from 'next/navigation';
import Layout from '@/components/FlatSite/Layout';
import retroFont from '@/components/RetroFont';

export default function SongPage() {
  const [isMobile, setIsMobile] = useState(false);

  const { name } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const services = [
    {
      name: "Spotify",
      link: "https://ffm.to/dafna-" + name + "/spotify",
      icon: <IconSpotify size={'20'} />
    },
    {
      name: "Apple Music",
      link: "https://ffm.to/dafna-" + name + "/apple",
      icon: <IconAppleMusic size={'20'} />
    },
    {
      name: "Tidal",
      link: "https://ffm.to/dafna-" + name + "/tidal",
      icon: <IconTidal size={'20'} />
    },
    {
      name: "YouTube",
      link: "https://ffm.to/dafna-" + name + "/youtube",
      icon: <IconYoutube size='20' /> 
    },
    {
      name: "Deezer",
      link: "https://ffm.to/dafna-" + name + "/deezer",
      icon: ""
    },
    {
      name: "Amazon Music",
      link: "https://ffm.to/dafna-" + name + "/amazon",
      icon: ""
    },
        {
      name: "SoundCloud",
      link: "https://ffm.to/dafna-" + name + "/soundcloud",
      icon: ""
    },
  ]

  return (
    <Layout>
      <div className={`flex  flex-col items-center p-4 text-cyan-700 min-h-screen ${retroFont.className}`}>
          <Link href="/" className="flex justify-center mb-2">
            <DafnaLogo width={200} height={100} />
          </Link>
 <div className="relative w-72 h-72">
        <Image
          src="/images/chaos.jpg"
          alt="song cover"
          fill
          priority
          className="object-contain"
        />
        </div>
          <div className="flex pt-4 space-y-4 flex-col">
          {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-4 w-80 h-12 px-4 text-lg font-medium bg-cyan/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                {service.icon}
                <h2 className="text-lg font-semibold text-cyan-500">Stream on {service.name}</h2>
              </Link>
            ))}
          </div>
      </div>
    </Layout>
  );
};
