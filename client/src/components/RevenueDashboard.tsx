"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import {
    ArrowUpRight,
    TrendingUp,
    Users,
    CreditCard,
    Activity,
    Clock,
    DollarSign,
    LineChart as LineChartIcon,
} from "lucide-react";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Legend,
} from "recharts";

const RevenueDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month");

    const revenueData = [
        {
            month: "Tháng 1",
            revenue: 6800000,
            profit: 2000000,
            customers: 180,
            avgTime: 2.5,
        },
        {
            month: "Tháng 2",
            revenue: 8300000, 
            profit: 3000000,
            customers: 210,
            avgTime: 2.8,
        },
        {
            month: "Tháng 3",
            revenue: 7000000, 
            profit: 2500000,
            customers: 195,
            avgTime: 2.3,
        },
        {
            month: "Tháng 4",
            revenue: 8500000, 
            profit: 3500000,
            customers: 250,
            avgTime: 3.0,
        },
        {
            month: "Tháng 5",
            revenue: 7200000,
            profit: 2800000,
            customers: 220,
            avgTime: 2.7,
        },
    ];

    const formatCurrency = (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const formatTime = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h${m ? ` ${m}m` : ""}`;
    };

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-blue-900 text-white px-4 py-3 rounded-xl shadow-xl border border-blue-700">
                    <div className="font-medium text-lg mb-2">{label}</div>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-200">Doanh thu:</span>
                            <span className="font-semibold text-blue-100 ml-4">
                                {formatCurrency(data.revenue)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-200">Lợi nhuận:</span>
                            <span className="font-semibold text-green-100 ml-4">
                                {formatCurrency(data.profit)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-violet-200">Khách hàng:</span>
                            <span className="font-semibold text-violet-100 ml-4">
                                {data.customers}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-amber-200">TG TB:</span>
                            <span className="font-semibold text-amber-100 ml-4">
                                {formatTime(data.avgTime)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };


    useEffect(() => {
        gsap.fromTo(
            ".stat-card",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.15,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <main className="p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-blue-900">
                        Tổng Quan Doanh Thu
                    </h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedPeriod("week")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === "week"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white/50 text-blue-600 hover:bg-white/80"
                            }`}
                        >
                            Tuần
                        </button>
                        <button
                            onClick={() => setSelectedPeriod("month")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === "month"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white/50 text-blue-600 hover:bg-white/80"
                            }`}
                        >
                            Tháng
                        </button>
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-8 h-8 opacity-80" />
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-blue-100 font-medium">
                            Tổng Doanh thu
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            {formatCurrency(37800000)} 
                        </p>
                        <p className="text-blue-100 text-sm mt-2">
                            +12% so với tháng trước
                        </p>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-8 h-8 opacity-80" />
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-green-100 font-medium">
                            Tổng Lợi nhuận
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            {formatCurrency(13800000)} 
                        </p>
                        <p className="text-green-100 text-sm mt-2">
                            +15% so với tháng trước
                        </p>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8 opacity-80" />
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-violet-100 font-medium">
                            Lượng khách
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            {revenueData.reduce((acc, curr) => acc + curr.customers, 0)} 
                        </p>
                        <p className="text-violet-100 text-sm mt-2">
                            +18% so với tháng trước
                        </p>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-8 h-8 opacity-80" />
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-amber-100 font-medium">
                            Thời gian trung bình
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            {formatTime(revenueData.reduce((acc, curr) => acc + curr.avgTime, 0) / revenueData.length)} {/* Average time */}
                        </p>
                        <p className="text-amber-100 text-sm mt-2">
                            +5% so với tháng trước
                        </p>
                    </div>
                </section>

                <div className="grid lg:grid-cols-5 gap-6">
                    <section className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-blue-900">
                                Doanh thu & Lợi nhuận theo tháng
                            </h3>
                            <LineChartIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="relative h-[400px] mt-6"> 
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={revenueData}
                                    margin={{ top: 30, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => formatCurrency(value).split("₫")[0]}
                                        domain={[0, Math.max(...revenueData.map(d => d.revenue)) * 1.1]} 
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        barSize={30}
                                        fill="url(#barGradient)"
                                        radius={[10, 10, 0, 0]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        name="Lợi nhuận"
                                        stroke="#10B981" 
                                        strokeWidth={2.5}
                                        dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                                        activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                                    />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.6}/>
                                        </linearGradient>
                                    </defs>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-blue-900">
                                Thống kê chi tiết
                            </h3>
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            {revenueData.map((item) => (
                                <div
                                    key={item.month}
                                    className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 group hover:from-blue-100 hover:to-green-100 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-blue-900 text-lg">
                                            {item.month}
                                        </h4>
                                        <span className="text-lg font-semibold text-green-600">
                                            {formatCurrency(item.profit)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-700">
                                        <span className="flex items-center gap-1 font-medium">
                                            <DollarSign className="w-4 h-4 text-blue-500" />
                                            <span className="text-blue-700">{formatCurrency(item.revenue)}</span>
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Users className="w-4 h-4 text-violet-500" />
                                            <span className="text-violet-700">{item.customers} khách</span>
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            <span className="text-amber-700">{formatTime(item.avgTime)}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default RevenueDashboard;