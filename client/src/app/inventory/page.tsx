"use client";
import { TriangleAlert, Search, Filter, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface InventoryItem {
    id: number;
    name: string;
    price: number;
    costPrice: number;
    unit: string;
    quantity: number;
    [key: string]: string | number;
}

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({ key: null, direction: "ascending" });
    const [filterUnit, setFilterUnit] = useState("all");
    const [filterStock, setFilterStock] = useState("all");

    const orders: InventoryItem[] = [
        { id: 1, name: "Pepsi", price: 20000, costPrice: 10000, unit: "chai", quantity: 227 },
        { id: 2, name: "Sting", price: 20000, costPrice: 11000, unit: "chai", quantity: 345 },
        { id: 3, name: "Trà Ô-long", price: 20000, costPrice: 9000, unit: "chai", quantity: 98 },
        { id: 4, name: "Revive", price: 20000, costPrice: 10000, unit: "chai", quantity: 232 },
        { id: 5, name: "Redbull", price: 25000, costPrice: 13000, unit: "chai", quantity: 55 },
        { id: 6, name: "Nước suối", price: 10000, costPrice: 5000, unit: "chai", quantity: 342 },
        { id: 7, name: "555", price: 40000, costPrice: 25000, unit: "gói", quantity: 18 },
        { id: 8, name: "seven", price: 30000, costPrice: 18000, unit: "gói", quantity: 56 },
        { id: 9, name: "Craven A", price: 30000, costPrice: 18000, unit: "gói", quantity: 65 },
        { id: 10, name: "Khoai tây chiên", price: 30000, costPrice: 15000, unit: "phần", quantity: 77 },
        { id: 11, name: "Khô bò", price: 60000, costPrice: 40000, unit: "phần", quantity: 33 },
        { id: 12, name: "Khô mực nướng", price: 60000, costPrice: 40000, unit: "phần", quantity: 22 },
        { id: 13, name: "Hạt điều", price: 30000, costPrice: 15000, unit: "phần", quantity: 54 },
    ];
    const lowStockBottles = 60;
    const lowStockPacks = 25;
    const lowStockSnacks = 30;

    const getThresholdByUnit = (unit: string): number => {
        switch (unit) {
            case "chai":
                return lowStockBottles;
            case "gói":
                return lowStockPacks;
            case "phần":
                return lowStockSnacks;
            default:
                return 0;
        }
    };



    const filteredOrders = orders.filter(order => {
        // Lọc theo từ khóa tìm kiếm
        const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Lọc theo đơn vị
        const matchesUnit = filterUnit === "all" || order.unit === filterUnit;

        // Lọc theo trạng thái kho
        const matchesStock = filterStock === "all" ||
            (filterStock === "low" && order.quantity < getThresholdByUnit(order.unit)) ||
            (filterStock === "normal" && order.quantity >= getThresholdByUnit(order.unit));

        return matchesSearch && matchesUnit && matchesStock;
    });


    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const direction = sortConfig.direction === "ascending" ? 1 : -1;

        if (a[sortConfig.key] < b[sortConfig.key]) {
            return -1 * direction;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return 1 * direction;
        }
        return 0;
    });


    const requestSort = (key: string) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };


    const uniqueUnits = ["all", ...new Set(orders.map(order => order.unit))];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto text-blue-900">
                <h1 className="text-4xl font-bold">Kho hàng</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={28} /> Thêm mới
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <div className="lg:col-span-3">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-wrap gap-4 mb-6">

                            <div className="relative flex-grow max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <select
                                    value={filterUnit}
                                    onChange={(e) => setFilterUnit(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tất cả đơn vị</option>
                                    {uniqueUnits.filter(unit => unit !== "all").map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={filterStock}
                                    onChange={(e) => setFilterStock(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tất cả số lượng</option>
                                    <option value="low">Sắp hết hàng</option>
                                    <option value="normal">Còn hàng</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-auto">
                            <table className="min-w-full text-lg">
                                <thead className="bg-gray-100 text-gray-700 text-left text-base">
                                    <tr>
                                        <th
                                            className="p-4 min-w-[220px] cursor-pointer hover:bg-gray-200"
                                            onClick={() => requestSort("name")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Tên hàng
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="p-4 min-w-[180px] cursor-pointer hover:bg-gray-200"
                                            onClick={() => requestSort("price")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Giá
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="p-4 min-w-[140px] cursor-pointer hover:bg-gray-200"
                                            onClick={() => requestSort("costPrice")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Giá nhập
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="p-4 min-w-[140px] cursor-pointer hover:bg-gray-200"
                                            onClick={() => requestSort("quantity")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Số lượng
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th className="p-4 text-right">Đơn vị</th>
                                        <th className="p-4 min-w-[100px] text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedOrders.map((order) => (
                                        <tr key={order.id} className="border-t hover:bg-gray-50 text-base">
                                            <td className="p-4 font-medium text-gray-900">
                                                <div className="flex items-center font-bold gap-2">
                                                    {order.name}
                                                </div>
                                            </td>
                                            <td className="p-4">{order.price.toLocaleString('vi-VN')} đ</td>
                                            <td className="p-4">{order.costPrice.toLocaleString('vi-VN')} đ</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-block min-w-[32px] ${order.quantity < getThresholdByUnit(order.unit) ? "text-red-600 font-medium" : ""}`}>
                                                        {order.quantity}
                                                    </span>
                                                    {order.quantity < getThresholdByUnit(order.unit) && (
                                                        <div className="flex items-center">
                                                            <TriangleAlert className="text-red-500 w-4 h-4" />
                                                            <span className="text-red-500 text-xs ml-1">Sắp hết</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                {order.unit}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {sortedOrders.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Tổng số sản phẩm</h3>
                        <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Sản phẩm sắp hết</h3>
                        <p className="text-3xl font-bold text-orange-500">
                            {orders.filter(order => order.quantity < getThresholdByUnit(order.unit)).length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Tổng giá trị kho</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {orders.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0)
                                .toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}