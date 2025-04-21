"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { deleteUser } from "@/libraries/userAPI";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dotCount, setDotCount] = useState(0);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

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

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        console.log(session?.user?.token)
        console.log(userId)

        try {
            await deleteUser(session?.user?.token || "", userId);
            await signOut({ redirect: false });
            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
                Delete Account
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-center">Delete Account</h2>
                        <p className="text-sm text-center text-gray-600 mt-2">Are you sure you want to delete your account?</p>
                        
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:bg-red-300"
                                disabled={loading}
                            >
                                {loading ? `Deleting${'.'.repeat(dotCount + 1)}` : "Yes, Delete"}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </div>
                </div>
            )}
        </>
    );
}