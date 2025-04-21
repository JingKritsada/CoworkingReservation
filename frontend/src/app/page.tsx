"use client";
import Banner from "@/components/Banner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const images = [
  "/images/pyramid.jpg",
  "/images/cat-cafe.png",
  "/images/moon-lounge.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true); // start fade-in
      }, 500); // match transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getOffsetIndex = (offset: number) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  return (
    <main>
      <Banner />

      {/* Text above image */}
      <div className="max-w-4xl mx-auto mt-16 mb-10 px-4">
        <div className="text-left text-gray-900 space-y-2 leading-tight animate-slide-in-out">
          <p className="text-5xl font-bold">EXPERIENCE</p>
          <p className="text-6xl font-extrabold">SOMETHING</p>
          <p className="text-2xl font-medium text-gray-700">
            YOU HAVE NEVER MET
          </p>
        </div>
      </div>

      {/* Sliding Image Section */}
      <div className="relative mb-40 max-w-6xl mx-auto flex items-center justify-center gap-6 overflow-hidden">
        {/* Left Image - blurred */}
        <img
          src={images[getOffsetIndex(-1)]}
          alt="Left"
          className="w-1/4 h-[400px] object-cover rounded-lg opacity-50 blur-sm transition-all duration-700"
        />

        {/* Center Image with fade effect and button */}
        <div className="relative group w-1/2">
          <img
            src={images[getOffsetIndex(0)]}
            alt="Adventure"
            className={`w-full h-[400px] object-cover rounded-lg shadow-lg transition-all duration-700 ease-in-out ${
              fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => router.push("/explore")}
              className="text-white border border-white px-6 py-3 rounded-full bg-white bg-opacity-10 hover:bg-opacity-30 transition font-semibold text-lg shadow-lg backdrop-blur-md"
            >
              Venture Into The Unknown 🚀
            </button>
          </div>
        </div>

        {/* Right Image - blurred */}
        <img
          src={images[getOffsetIndex(1)]}
          alt="Right"
          className="w-1/4 h-[400px] object-cover rounded-lg opacity-50 blur-sm transition-all duration-700"
        />
      </div>
    </main>
  );
}
