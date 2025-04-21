"use client";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Home, Search, Calendar, Info } from "lucide-react";
import { useSession } from "next-auth/react";
export default function TopMenu() {
  const { data: session, status } = useSession();
  //console.log(session);

  let accountPath = "/auth/profile";
  if (!session) {
    accountPath = "/auth/signin";
  }

  console.log("session", session);

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={24} /> },
    { name: "Explore", path: "/explore", icon: <Search size={24} /> },
    { name: "Booking", path: "/booking", icon: <Calendar size={24} /> },
    { name: "About", path: "/about", icon: <Info size={24} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-xl rounded-full m-5 px-6 py-3 z-50 flex items-center justify-between transition-all duration-300 hover:shadow-2xl">
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={50}
          height={50}
          priority
          className="w-auto h-auto transition-opacity duration-200 hover:opacity-80 hover:scale-110"
        />
      </Link>

      <nav className="flex space-x-8">
        {menuItems.map((item) => (
          <TopMenuItem
            key={item.name}
            title={item.name}
            pageRef={item.path}
            icon={item.icon}
          />
        ))}
      </nav>

      <nav>
        <Link
          href={accountPath}
          className="flex flex-col items-center space-y-1"
        >
          <div className="transition-transform duration-200 hover:scale-110">
            <Image
              src="/images/avatar.png"
              alt="avatar"
              width={50}
              height={50}
              priority
              className="w-auto h-auto transition-opacity duration-200 hover:opacity-80"
            />
          </div>
        </Link>
      </nav>
    </header>
  );
}
