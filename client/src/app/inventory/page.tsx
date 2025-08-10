"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import { TriangleAlert, Search, Filter, Plus, Edit, Trash2, ArrowUpDown, Save } from "lucide-react";
import gsap from "gsap";
import Notification from '@/components/Notification';
import { formatCurrency } from "@/lib/formatCurrency";
import ConfirmationModal from "@/components/common/ConfirmationModal";
interface InventoryItem {
    id: number;
    name: string;
    price: number;
    costPrice: number;
    unit: string;
    quantity: number;
}

interface NotificationState {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

const lowStockThresholds = {
    "chai": 60,
    "gói": 25,
    "phần": 30,
};

const getThresholdByUnit = (unit: string): number => {
    return lowStockThresholds[unit as keyof typeof lowStockThresholds] || 0;
};


export default function InventoryPage() {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem | null, direction: 'ascending' | 'descending' }>({ key: null, direction: "ascending" });
    const [filterUnit, setFilterUnit] = useState("all");
    const [filterStock, setFilterStock] = useState("all");
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<InventoryItem | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
    const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });
    const [loading, setLoading] = useState(false);
    const pageRef = useRef(null);
    const addEditModalRef = useRef<HTMLDivElement>(null);
    const deleteModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        import('@/utils/api').then(({ default: api }) => {
            api.get('/inventory')
                .then(res => {
                    setInventoryItems(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    setNotification({ visible: true, message: 'Lỗi khi tải dữ liệu kho hàng!', type: 'error' });
                    console.error('API error:', err);
                    setTimeout(() => handleHideNotification(), 3000);
                });
        });
        gsap.fromTo(
            pageRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ visible: true, message, type });
        setTimeout(() => handleHideNotification(), 3000);
    };

    const handleHideNotification = () => {
        setNotification({ visible: false, message: '', type: 'info' });
    };

    const openAddModal = () => {
        setCurrentEditItem(null);
        setShowAddEditModal(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setCurrentEditItem({ ...item });
        setShowAddEditModal(true);
    };

    const closeAddEditModal = () => {
        if (addEditModalRef.current) {
            gsap.to(addEditModalRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    setShowAddEditModal(false);
                    setCurrentEditItem(null);
                },
            });
        }
    };

    const handleSaveItem = async (item: InventoryItem) => {
        try {
            const api = (await import('@/utils/api')).default;
            if (item.id) {
                await api.put(`/inventory/${item.id}`, item);
            } else {
                await api.post('/inventory', item);
            }
            const res = await api.get('/inventory');
            setInventoryItems(res.data);
            handleShowNotification(item.id ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!', 'success');
            closeAddEditModal();
        } catch (err) {
            console.error('API error:', err);
            handleShowNotification('Lỗi khi lưu sản phẩm!', 'error');
        }
    };

    const handleDelete = (item: InventoryItem) => {
        setItemToDelete(item);
        setIsConfirmingDelete(true);
    };

    const confirmDelete = async () => {
        try {
            if (!itemToDelete) return;
            const api = (await import('@/utils/api')).default;
            await api.delete(`/inventory/${itemToDelete.id}`);
            setInventoryItems(inventoryItems.filter(inv => inv.id !== itemToDelete.id));
            setIsConfirmingDelete(false);
            setItemToDelete(null);
            handleShowNotification('Đã xoá sản phẩm thành công!', 'success');
        } catch (err) {
            console.error('API error:', err);
            handleShowNotification('Lỗi khi xoá sản phẩm!', 'error');
        }
    };

    const cancelDelete = () => {
        if (deleteModalRef.current) {
            gsap.to(deleteModalRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    setIsConfirmingDelete(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const requestSort = (key: keyof InventoryItem) => {
        let direction: 'ascending' | 'descending' = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedItems = [...inventoryItems]
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesUnit = filterUnit === "all" || item.unit === filterUnit;
            const matchesStock = filterStock === "all" ||
                (filterStock === "low" && item.quantity < getThresholdByUnit(item.unit)) ||
                (filterStock === "normal" && item.quantity >= getThresholdByUnit(item.unit));
            return matchesSearch && matchesUnit && matchesStock;
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue === undefined || bValue === undefined) return 0;
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'ascending'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    const uniqueUnits = [
        "all",
        ...Array.from(new Set(inventoryItems.map(item => item.unit)))
    ];

    const totalProducts = inventoryItems.length;
    const lowStockProducts = inventoryItems.filter(item => item.quantity < getThresholdByUnit(item.unit)).length;
    const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);

    return (
        <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
            {notification.visible && <Notification message={notification.message} type={notification.type} onClose={handleHideNotification} />}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Quản lý kho hàng
                </h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                    <Plus size={16} /> Thêm sản phẩm
                </button>
            </div>
            <div ref={pageRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 border space-y-6">
                    <div className="flex flex-wrap gap-4 mb-4 items-center">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    <div className="overflow-x-auto rounded-xl border">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
                        ) : (
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase">
                                <tr>
                                    <th
                                        onClick={() => requestSort("name")}
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            Tên hàng <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => requestSort("price")}
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            Giá <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => requestSort("costPrice")}
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            Giá nhập <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => requestSort("quantity")}
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            Số lượng <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">Đơn vị</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAndSortedItems.length > 0 ? (
                                    filteredAndSortedItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                                            <td className="px-6 py-4">{formatCurrency(item.costPrice)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`${item.quantity < getThresholdByUnit(item.unit) ? "text-red-600 font-semibold" : ""}`}>
                                                        {item.quantity}
                                                    </span>
                                                    {item.quantity < getThresholdByUnit(item.unit) && (
                                                        <TriangleAlert className="text-red-500 w-4 h-4" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{item.unit}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            Không tìm thấy sản phẩm nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Tổng số sản phẩm</h3>
                        <p className="text-4xl font-bold text-blue-600">{totalProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Sản phẩm sắp hết</h3>
                        <p className="text-4xl font-bold text-orange-500">
                            {lowStockProducts}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Tổng giá trị kho</h3>
                        <p className="text-4xl font-bold text-green-600">
                            {formatCurrency(totalInventoryValue)}
                        </p>
                    </div>
                </div>
            </div>
            {showAddEditModal && (
                <AddEditInventoryModal
                    ref={addEditModalRef}
                    item={currentEditItem}
                    onSave={handleSaveItem}
                    onClose={closeAddEditModal}
                    uniqueUnits={uniqueUnits.filter(unit => unit !== "all")}
                />
            )}
            {isConfirmingDelete && (
                <ConfirmationModal
                    ref={deleteModalRef}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    title="Xác nhận xoá sản phẩm"
                    message="Bạn có chắc chắn muốn xoá sản phẩm này khỏi kho? Thao tác này không thể hoàn tác."
                    confirmText="Xoá"
                    cancelText="Huỷ"
                    color="red"
                />
            )}
        </div>
    );
}

interface AddEditInventoryModalProps {
    item: InventoryItem | null;
    onSave: (item: InventoryItem) => void;
    onClose: () => void;
    uniqueUnits: string[];
}

const AddEditInventoryModal = forwardRef<HTMLDivElement, AddEditInventoryModalProps>(
    ({ item, onSave, onClose, uniqueUnits }, ref) => {
        const [formData, setFormData] = useState<InventoryItem>(
            item || { id: 0, name: '', price: 0, costPrice: 0, unit: uniqueUnits[0] || '', quantity: 0 }
        );
        const [error, setError] = useState('');

        useEffect(() => {
            if (ref && 'current' in ref && ref.current) {
                gsap.fromTo(
                    ref.current,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.3 }
                );
            }
        }, [ref]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'costPrice' || name === 'quantity' ? Number(value) : value
            }));
            setError('');
        };

        const handleSubmit = () => {
            if (!formData.name || !formData.unit || formData.price <= 0 || formData.costPrice <= 0 || formData.quantity < 0) {
                setError('Vui lòng nhập đầy đủ và chính xác thông tin sản phẩm (Giá và Số lượng phải lớn hơn 0).');
                return;
            }
            onSave(formData);
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
                <div ref={ref} className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-md mx-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {item ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập</label>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {uniqueUnits.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
                        >
                            <Save size={16} className="inline-block mr-2" /> Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);
AddEditInventoryModal.displayName = 'AddEditInventoryModal';
