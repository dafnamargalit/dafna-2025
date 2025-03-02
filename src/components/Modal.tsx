import React, { useEffect, useState } from "react";
import { IconAppleMusic, IconSpotify, IconTidal, IconYoutube } from "./Icons";

export type ModalData = {
    name: string,
    spotify: string,
    youtube: string,
    tidal: string,
    apple: string
}

const Modal = ({ closeModal, modalData, isMobile }: {closeModal: () => void, modalData: ModalData, isMobile: boolean}) => {

    const [isChecked, setIsChecked] = useState(false);

    const rememberService = (service: string, url: string) => {
        if (isChecked){
            localStorage.setItem("streaming-service", service);
        } 
        window.open(url);
    }

    return(
        <>
        <div
        className={`absolute text-cyan-300 flex flex-col bg-gray-700/75 bottom-0 z-50 justify-center items-center w-screen h-screen`}
        onClick={closeModal} // Close modal when clicking outside the content
        >
        {/* Modal Content */}
        <div
        className="flex flex-col justify-center items-center space-y-6 w-30 h-30 m-10 text-center p-10"
          onClick={(e) => e.stopPropagation()}
        >
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>select your preferred service:</h2>
        <div className='flex flex-row space-x-2'>
            <button onClick={() => rememberService("spotify", modalData.spotify)}>
            <IconSpotify />
            </button>
            <button onClick={() => rememberService("apple", modalData.apple)}>
            <IconAppleMusic />
            </button>
            <button onClick={() => rememberService("youtube", modalData.youtube)}>
            <IconYoutube />
            </button>
            <button onClick={() => rememberService("tidal", modalData.tidal)}>
            <IconTidal />
            </button>
        </div>
        <div className="flex flex-row justify-center items-center">
        <label className="flex justify-center items-center cursor-pointer relative mx-2">
        <input type="checkbox" onInput={() => setIsChecked(!isChecked)} className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-cyan-300 checked:bg-cyan-300 checked:border-cyan-400" id="check1" />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
        </span>
        </label>
       Check here to remember your selection
       </div>
        </div>
      </div>
      </>
    )
    }

export default Modal;