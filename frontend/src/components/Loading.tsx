import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
            <div className="border-4 border-gray-200 border-t-black rounded-full w-10 h-10 animate-spin"></div>
        </div>
    );
};
