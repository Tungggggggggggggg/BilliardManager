import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Billiard Manager",
    description: "Hệ thống quản lý billiard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className="light tc-new-price">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen`}
            >
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
