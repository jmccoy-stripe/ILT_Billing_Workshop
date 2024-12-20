"use client";
import type { Metadata } from "next";
import { usePathname } from "next/navigation"; // To get the current route
import localFont from "next/font/local";
import Header from "@/components/Header";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

// const metadata: Metadata = {
//     title: "ILT Workshop",
//     description: "ILT Workshop",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    // Define routes where the Header should be shown
    const showHeader = !(pathname == "/signin" || pathname === "/signup");
    return (
        <html lang="en-US">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {showHeader && <Header />}
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
