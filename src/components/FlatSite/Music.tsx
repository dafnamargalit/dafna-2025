import React, { useState, useEffect, useCallback } from 'react';
import { albums } from '@/lib/constants';
import Modal, { ModalData } from '../Modal';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

const Music: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAlbum, setSelectedAlbum] = useState<ModalData | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAlbumClick = (album: typeof albums[0]) => {
    const service = localStorage.getItem("streaming-service");
    if (service) {
      switch (service) {
        case "spotify":
          window.open(album.spotify, '_blank');
          break;
        case "youtube":
          window.open(album.youtube, '_blank');
          break;
        case "tidal":
          window.open(album.tidal, '_blank');
          break;
        case "apple":
          window.open(album.apple, '_blank');
          break;
        default:
          setSelectedAlbum(album);
          setShowModal(true);
          break;
      }
    } else {
      setSelectedAlbum(album);
      setShowModal(true);
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.5)] mb-8">
        Music
      </h1>
      
      <div className="relative w-full max-w-2xl h-96">
        {/* Previous Button */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {albums.map((album) => (
              <div
                key={album.name}
                className="flex-[0_0_100%] min-w-0 flex flex-col items-center"
              >
                <div
                  className={`w-full ${isMobile ? 'h-64' : 'h-96'} flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAlbumClick(album)}
                >
                  <Image
                    src={`/images/${album.name}.jpg`}
                    alt={album.name}
                    width={isMobile ? 500 : 1000}
                    height={isMobile ? 500 : 1000}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
                  />
                </div>
                <button
                  onClick={() => handleAlbumClick(album)}
                  className="bg-cyan-300 text-cyan-700 font-bold py-2 px-6 border-solid border-2 border-cyan-500 hover:bg-opacity-70 cursor-pointer transition-colors shadow-lg hover:shadow-xl mt-2"
                >
                  Listen Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedAlbum && (
        <Modal
          closeModal={() => setShowModal(false)}
          modalData={selectedAlbum}
          isMobile={isMobile}
          optional={true}
        />
      )}
    </div>
  );
};

export default Music;
