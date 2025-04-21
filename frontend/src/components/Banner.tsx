"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import getUserProfile from "@/libraries/userAPI";
import Loading from "@/components/Loading";

export default function Banner() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user.token) {
        setLoading(true);

        try {
          const userProfile = await getUserProfile(session.user.token);
          setUserName(userProfile.data.name);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }

        setLoading(false);
      }
    };

    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 3);
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const covers = [
    "/images/cover1.jpg",
    "/images/cover2.jpg",
    "/images/cover3.jpg",
    "/images/cover4.jpg",
  ];

  return (
    <div
      className="relative w-full h-[50vh] min-h-[550px] overflow-hidden"
      onClick={() => setIndex(index + 1)}
    >
      <Image
        src={covers[index % covers.length]}
        alt="Co-working space"
        fill
        priority
        className="object-cover object-center brightness-75 transition-opacity duration-500"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-left text-white">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider">
          FIND YOUR IDEAL WORKSPACE
        </h1>
        <h3 className="text-md md:text-2xl font-medium text-gray-200 mt-2 tracking-wide">
          Discover and book the perfect co-working space for your needs.
        </h3>
      </div>

      {session ? (
        <div className="absolute bottom-8 left-10 text-white px-3 py-1 rounded-md text-lg border border-white tracking-wide">
          {loading
            ? `Welcome, ${".".repeat(dotCount + 1)}`
            : `Welcome, ${userName}`}
        </div>
      ) : (
        ""
      )}

      <button
        className="absolute right-8 bottom-8 bg-cyan-600 text-white text-lg font-medium py-2 px-5 rounded-md shadow-md hover:bg-cyan-700 transition duration-300"
        onClick={() => router.push("/reservation")}
      >
        Reserve Now !!!
      </button>
    </div>
  );
}
