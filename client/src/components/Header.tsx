"use client";

import React from "react";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                📊 Billiard Dashboard
            </h1>
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 transition-all"
                >
                    <Settings className="w-5 h-5 mr-1" /> Cài đặt
                </Button>
                <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                >
                    <LogOut className="w-5 h-5 mr-1" /> Đăng xuất
                </Button>
            </div>
        </header>
    );
};

export default Header;
