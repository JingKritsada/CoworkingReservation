'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopMenuItem({ title, pageRef, icon }: { title: string, pageRef: string, icon?: JSX.Element }) {
    const currentPath = usePathname();

    return (
        <Link
            key={title}
            href={pageRef}
            className="group flex flex-col items-center space-y-1"
        >
            <div className={`p-2.5 rounded-xl transition-all duration-200 ease-in-out transform origin-center hover:scale-110 
                ${currentPath === pageRef
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "text-gray-600 hover:bg-blue-100"
                }`}
            >
                {icon}
            </div>
            <span className={`text-xs font-medium transition-colors duration-200
                ${currentPath === pageRef
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
            >
                {title}
            </span>
        </Link>
    );
}