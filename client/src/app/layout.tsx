import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const roboto = Roboto({
    variable: "--font-roboto-sans",
    subsets: ["vietnamese"],
    weight: ["100", "300", "400", "500", "700", "900"]
});

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["vietnamese"],
    weight: ["100", "300", "400", "500", "700"]
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
        <html lang="vi" className="light tc-new-price h-full">
            <body
                className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased flex h-full`}
            >
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
