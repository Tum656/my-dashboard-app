import { Outfit } from "next/font/google";

import { SidebarProvider } from "../components/context/SidebarContext";
import { ThemeProvider } from "../components/context/ThemeContext";
import "../styles/globals.css";

const outfit = Outfit({
    subsets: ["latin"],
});

export const metadata = {
    title: "Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
