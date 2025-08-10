"use client";


import React, { useState, useEffect, useRef } from "react";
import { Table, Clock, DollarSign, Search, X } from "lucide-react";
import gsap from "gsap";

type TableStatus = "available" | "occupied" | "reserved";
interface TableData {
    id: number;
    status: TableStatus;
    usageTime: number;
    revenue: number;
}

function normalizeTableStatus(status: string): TableStatus {
    switch (status?.trim()) {
        case "Trống":
            return "available";
        case "Đang dùng":
            return "occupied";
        case "Đã đặt":
            return "reserved";
        default:
            return "available";
    }
}

type RawTableApi = {
    id?: number | string;
    status?: string;
    usageTime?: number | string;
    usagetime?: number | string;
    revenue?: number | string;
};

function isRawTableApi(obj: unknown): obj is RawTableApi {
    return (
        typeof obj === 'object' && obj !== null &&
        ('id' in obj) && ('status' in obj)
    );
}

function normalizeTableApiData(t: unknown): TableData {
    if (isRawTableApi(t)) {
        return {
            id: t.id !== undefined ? Number(t.id) : 0,
            status: normalizeTableStatus(t.status ?? ''),
            usageTime: t.usageTime !== undefined ? Number(t.usageTime) : (t.usagetime !== undefined ? Number(t.usagetime) : 0),
            revenue: t.revenue !== undefined ? Number(t.revenue) : 0,
        };
    }
    return { id: 0, status: 'available', usageTime: 0, revenue: 0 };
}

const TablesManagement: React.FC = () => {
    const [tables, setTables] = useState<TableData[]>([]);
            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
            useEffect(() => {
                fetch(`${API_BASE}/api/tables`)
                    .then(res => res.json())
                    .then((data: unknown) => {
                        if (Array.isArray(data)) {
                            setTables(data.map(normalizeTableApiData));
                        } else {
                            setTables([]);
                        }
                    })
                    .catch(() => setTables([]));
            }, []);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const tableCardsRef = useRef<HTMLDivElement[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (typeof window !== "undefined") {
                const validRefs = tableCardsRef.current.filter(Boolean);
                if (validRefs.length > 0) {
                    gsap.fromTo(
                        validRefs,
                        { opacity: 0, scale: 0.9 },
                        { opacity: 1, scale: 1, duration: 0.01, stagger: 0.15, ease: "power2.out" }
                    );
                }
            }
        }, [tables]);

    useEffect(() => {
        if (sidebarRef.current) {
            if (selectedTable !== null) {
                gsap.to(sidebarRef.current, {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    display: "block",
                });
            } else {
                gsap.to(sidebarRef.current, {
                    x: "100%",
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        if (sidebarRef.current) {
                            sidebarRef.current.style.display = "none";
                        }
                    },
                });
            }
        }
    }, [selectedTable]);

    const filteredTables = tables.filter((table) =>
        table.id.toString().includes(searchTerm)
    );

    const toggleStatus = async (id: number) => {
        const table = tables.find((t) => t.id === id);
        if (!table) return;
        let newStatus: TableStatus = table.status;
        if (table.status === "available") newStatus = "occupied";
        else if (table.status === "occupied") newStatus = "available";
        import('@/utils/api').then(({ default: api }) => {
            api.put(`/tables/${id}`, { ...table, status: newStatus === "available" ? "Trống" : newStatus === "occupied" ? "Đang dùng" : "Đã đặt" })
                .then(res => {
                    const updated = normalizeTableApiData(res.data);
                    setTables((prev) => prev.map((t) => t.id === id ? updated : t));
                })
                .catch(() => {});
        });
    };

    const handlePayment = (id: number) => {
        setSelectedTable(id);
        setShowPaymentModal(true);
    };

    const closeModal = () => {
        const modal = document.getElementById("payment-modal");
        if (modal) {
            gsap.to(modal, {
                scale: 0.9,
                autoAlpha: 0,
                duration: 0.3,
                ease: "power1.inOut",
                onComplete: () => setShowPaymentModal(false),
            });
        } else {
            setShowPaymentModal(false);
        }
    };

    const confirmPayment = async () => {
        const table = tables.find((t) => t.id === selectedTable);
        if (!table) return;
        import('@/utils/api').then(({ default: api }) => {
            api.post(`/tables/${selectedTable}/pay`, { revenue: table.revenue, usageTime: table.usageTime })
                .then(() => {
                    setShowPaymentModal(false);
                    setSelectedTable(null);
                    api.get('/tables')
                        .then(res => {
                            if (Array.isArray(res.data)) {
                                setTables(res.data.map(normalizeTableApiData));
                            } else {
                                setTables([]);
                            }
                        });
                })
                .catch(() => {});
        });
    };


    return (
        <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 flex-1 overflow-auto relative">
            <div className={`max-w-7xl mx-auto transition-all duration-300 ${selectedTable ? "mr-96" : ""}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                        <Table className="w-8 h-8" /> Quản lý Bàn
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm bàn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTables.map((table, index) => (
                        <div
                            key={table.id}
                            ref={(el) => {
                                if (el) tableCardsRef.current[index] = el;
                            }}
                            className={`table-card bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md border ${
                                table.status === "available"
                                    ? "border-green-200 hover:border-green-300"
                                    : table.status === "occupied"
                                    ? "border-red-200 hover:border-red-300"
                                    : "border-yellow-200 hover:border-yellow-300"
                            } transition-all duration-300 hover:shadow-lg cursor-pointer`}
                            onClick={() => setSelectedTable(table.id)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">Bàn {table.id}</h3>
                                <span
                                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                                        table.status === "available"
                                            ? "bg-green-100 text-green-800"
                                            : table.status === "occupied"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {table.status === "available"
                                        ? "Trống"
                                        : table.status === "occupied"
                                        ? "Đang dùng"
                                        : "Đã đặt"}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Thời gian: {table.usageTime > 0 ? `${table.usageTime}h` : "Chưa sử dụng"}
                                </p>
                                <p className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" /> Doanh thu: {formatCurrency(table.revenue)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatus(table.id);
                                }}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`Chuyển trạng thái bàn ${table.id}`}
                            >
                                {table.status === "available" ? "Bắt đầu" : "Kết thúc"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div
                ref={sidebarRef}
                className="fixed top-0 right-0 h-full w-96 bg-white/90 backdrop-blur-md shadow-lg p-6 z-50 overflow-y-auto hidden"
                style={{ display: selectedTable ? "block" : "none" }}
            >
                {selectedTable && (
                    <>
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">
                            Thông tin Bàn {selectedTable}
                        </h3>
                        <div className="space-y-4 text-sm text-gray-700">
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                {(() => {
                                    const t = tables.find((t) => t.id === selectedTable);
                                    if (!t) return "Không rõ";
                                    if (t.status === "available") return "Trống";
                                    if (t.status === "occupied") return "Đang dùng";
                                    return "Đã đặt";
                                })()}
                            </p>
                            <p>
                                <strong>Thời gian sử dụng:</strong>{" "}
                                {(() => {
                                    const t = tables.find((t) => t.id === selectedTable);
                                    if (t && t.usageTime > 0) {
                                        return `${t.usageTime}h`;
                                    } else {
                                        return "Chưa sử dụng";
                                    }
                                })()}
                            </p>
                            <p>
                                <strong>Doanh thu:</strong>{" "}
                                {formatCurrency(
                                    tables.find((t) => t.id === selectedTable)?.revenue || 0
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => handlePayment(selectedTable)}
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={`Thanh toán cho bàn ${selectedTable}`}
                        >
                            Thanh toán
                        </button>
                        <button
                            onClick={() => {
                                if (sidebarRef.current) {
                                    gsap.to(sidebarRef.current, {
                                        x: "100%",
                                        autoAlpha: 0,
                                        duration: 0.4,
                                        ease: "power2.in",
                                        onComplete: () =>
                                            setSelectedTable(null),
                                    });
                                } else {
                                    setSelectedTable(null);
                                }
                            }}
                            className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-all focus:outline-none"
                            aria-label="Đóng thanh bên"
                        >
                            Đóng
                        </button>
                    </>
                )}
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div
                        id="payment-modal"
                        className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                    >
                        <h3 className="text-xl font-bold text-blue-900 mb-4">
                            Xác nhận Thanh toán
                        </h3>
                        <div className="space-y-4 text-sm text-gray-700">
                            <p>
                                <strong>Bàn:</strong> Bàn {selectedTable}
                            </p>
                            <p>
                                <strong>Doanh thu:</strong>{" "}
                                {formatCurrency(
                                    tables.find((t) => t.id === selectedTable)
                                        ?.revenue || 0
                                )}
                            </p>
                            <p>
                                <strong>Thời gian sử dụng:</strong>{" "}
                                    {(() => {
                                        const t = tables.find((t) => t.id === selectedTable);
                                        if (t && t.usageTime > 0) {
                                            return `${t.usageTime}h`;
                                        } else {
                                            return "Chưa sử dụng";
                                        }
                                    })()}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                                aria-label="Hủy thanh toán"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmPayment}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Xác nhận thanh toán"
                            >
                                Xác nhận
                            </button>
                        </div>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            aria-label="Đóng khung xác nhận"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default TablesManagement;
