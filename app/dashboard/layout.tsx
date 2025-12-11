"use client";

import React, { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import Backdrop from "@/components/layout/Backdrop";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <AppSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Backdrop (Mobile only) */}
            <Backdrop isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                <AppHeader onMenuClick={() => setIsOpen(true)} />

                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
