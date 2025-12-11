"use client";

import React from "react";

export default function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm">
            <button
                className="md:hidden text-gray-700 text-2xl"
                onClick={onMenuClick}
            >
                ☰
            </button>

            <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>

            <div className="text-sm text-gray-600">Admin</div>
        </header>
    );
}
