"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                setDotCount(prev => (prev + 1) % 3);
            }, 300);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const handleSignOut = async () => {
        setLoading(true);
        setTimeout(async () => {
            await signOut({ callbackUrl: "/" });
        }, 500);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
            >
                Sign Out
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-center">Sign Out</h2>
                        <p className="text-sm text-center text-gray-600 mt-2">Are you sure you want to sign out?</p>

                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={handleSignOut}
                                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:bg-red-300"
                                disabled={loading}
                            >
                                {loading ? `Signing Out${'.'.repeat(dotCount + 1)}` : "Yes, Sign Out"}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
