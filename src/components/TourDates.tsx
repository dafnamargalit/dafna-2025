import React, { useEffect, useState } from "react";
import { TourList } from "./TourList";

const TourDates = ({ closeModal, isMobile }: {closeModal: () => void, isMobile: boolean}) => {
    return(
        <>
        <div
        className={`fixed inset-0 text-cyan-300 flex flex-col bg-gray-700/75 z-[100] justify-center items-center w-screen h-screen overscroll-none touch-none`}
        onClick={closeModal}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        >
        <div
        className="flex flex-col justify-center items-center space-y-6 w-50 h-50 m-10 text-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>tour dates</h2>
        <div className="w-screen px-16">
        <TourList />
        </div>
        </div>
      </div>
      </>
    )
    }

export default TourDates;