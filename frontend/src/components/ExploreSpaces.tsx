"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ExploreSpaces({ spaceJson }: { spaceJson: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const spaces = spaceJson?.data || [];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? spaces.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % spaces.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [spaces.length]);

  const getImageForSpace = (space: any) => {
    switch (space.space_id) {
      case 1:
        return "/images/pyramid.jpg";
      case 2:
        return "/images/cat-cafe.png";
      case 3:
        return "/images/moon-lounge.jpg";
      default:
        return "/images/default.jpg";
    }
  };

  const getIndex = (offset: number) => {
    return (currentIndex + offset + spaces.length) % spaces.length;
  };

  return (
    <div className="flex justify-center items-center mt-40 px-6 min-h-screen">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-10 border border-gray-200">
        {/* Carousel */}
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-12 tracking-wide animate-slide-in animate-textGlow">
          EXPLORE OUR SPACES
        </h2>
        <div className="relative mb-8 flex items-center justify-center gap-4 overflow-hidden">
          {/* Left image - smaller and faded */}
          <div
            key={getIndex(-1)}
            className="w-[20%] opacity-30 scale-75 transition-all duration-700 ease-in-out"
          >
            <img
              src={getImageForSpace(spaces[getIndex(-1)])}
              alt="Left"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>

          {/* Center Image */}
          <div
            key={getIndex(0)}
            className="w-[60%] scale-100 transition-all duration-700 ease-in-out"
          >
            <img
              src={getImageForSpace(spaces[getIndex(0)])}
              alt="Current"
              className="w-full h-[600px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Right Image */}
          <div
            key={getIndex(1)}
            className="w-[20%] opacity-30 scale-75 transition-all duration-700 ease-in-out"
          >
            <img
              src={getImageForSpace(spaces[getIndex(1)])}
              alt="Right"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-24 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:scale-110 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:scale-110 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Description */}
        <div className="text-left px-2">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {spaces[currentIndex]?.name}
          </h3>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Address:</strong> {spaces[currentIndex]?.address}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Telephone:</strong> {spaces[currentIndex]?.telephone}
          </p>
          <p className="text-md text-green-600 mt-4">
            <strong>Open Time:</strong> {spaces[currentIndex]?.open_time}
          </p>
          <p className="text-md text-red-600">
            <strong>Close Time:</strong> {spaces[currentIndex]?.close_time}
          </p>
        </div>
      </div>
    </div>
  );
}
