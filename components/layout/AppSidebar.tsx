"use client";

import SidebarWidget from "./SidebarWidget";

export default function AppSidebar({
                                       isOpen,
                                       onClose,
                                   }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-gray-900 text-gray-100 flex-col">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>

                <SidebarWidget />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-100 transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
            >
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Menu</h1>
                    <button onClick={onClose} className="text-gray-300 text-xl">
                        ×
                    </button>
                </div>

                <SidebarWidget onClick={onClose} />
            </aside>
        </>
    );
}
