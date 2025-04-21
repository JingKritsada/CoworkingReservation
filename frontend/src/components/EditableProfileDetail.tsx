"use client";

import { useState } from "react";

export default function EditableProfileDetail({
    label,
    value,
    field,
    userId,
    token,
}: {
    label: string;
    value: string;
    field: string;
    userId: string;
    token: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: inputValue }),
            });

            if (!response.ok) throw new Error("Update failed");

            window.location.reload();
        } catch (error) {
            console.error("Update error:", error);
            setInputValue(value);
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    return (
        <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-500">{label}</p>

            {isEditing ? (
                <div className="flex gap-2 mt-1">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-lg text-gray-900 flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition"
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => {
                            setInputValue(value);
                            setIsEditing(false);
                        }}
                        className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center mt-1">
                    <p className="text-lg text-gray-900">{value || "N/A"}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
}
