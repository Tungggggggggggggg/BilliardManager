'use client';

import React, { useState, useEffect, useRef} from 'react';
import {
  Plus,
  Info,
  Search,
  ArrowUpDown,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import gsap from 'gsap';
import Notification from '@/components/Notification';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  customer: string;
  phone: string;
  date: string;
  total: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
  items?: InvoiceItem[];
}

interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const InvoiceManagement = () => {
  const initialInvoices: Invoice[] = [
    {
      id: 'HD001',
      customer: 'Nguyễn Văn A',
      phone: '0123456789',
      date: '2025-08-02',
      status: 'Đã thanh toán',
      items: [
        { name: 'Pepsi', quantity: 2, price: 20000 },
        { name: 'Sting', quantity: 1, price: 20000 },
      ],
      total: 60000,
    },
    {
      id: 'HD002',
      customer: 'Trần Thị B',
      phone: '0987654321',
      date: '2025-08-01',
      status: 'Chưa thanh toán',
      items: [
        { name: 'Redbull', quantity: 1, price: 25000 },
        { name: 'Khoai tây chiên', quantity: 1, price: 30000 },
      ],
      total: 55000,
    },
    {
      id: 'HD003',
      customer: 'Lê Văn C',
      phone: '0901234567',
      date: '2025-07-30',
      status: 'Đã thanh toán',
      items: [
        { name: 'Nước suối', quantity: 3, price: 10000 },
        { name: '555', quantity: 1, price: 40000 },
      ],
      total: 70000,
    },
    {
      id: 'HD004',
      customer: 'Phạm Thị D',
      phone: '0922334455',
      date: '2025-08-03',
      status: 'Chưa thanh toán',
      items: [
        { name: 'Trà Ô-long', quantity: 2, price: 20000 },
        { name: 'Revive', quantity: 1, price: 20000 },
        { name: 'Hạt điều', quantity: 1, price: 30000 },
      ],
      total: 90000,
    },
  ];

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showDetail, setShowDetail] = useState<Invoice | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentEditInvoice, setCurrentEditInvoice] = useState<Invoice | null>(
    null
  );
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Invoice;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const pageRef = useRef(null);
  const deleteModalRef = useRef(null);
  const addEditModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handleShowNotification = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
    setNotification({ visible: true, message, type });
    setTimeout(() => handleHideNotification(), 3000);
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const openAddModal = () => {
    const newId = `HD${String(invoices.length + 1).padStart(3, '0')}`;
    setCurrentEditInvoice({
      id: newId,
      customer: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      total: 0,
      status: 'Chưa thanh toán',
      items: [],
    });
    setShowAddEditModal(true);
  };

  const openEditModal = (invoice: Invoice) => {
    setCurrentEditInvoice({ ...invoice });
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
          setCurrentEditInvoice(null);
        },
      });
    }
  };

  const handleSaveInvoice = (newInvoice: Invoice) => {
    if (invoices.find((inv) => inv.id === newInvoice.id)) {
      setInvoices(
        invoices.map((inv) => (inv.id === newInvoice.id ? newInvoice : inv))
      );
      handleShowNotification('Cập nhật hóa đơn thành công!', 'success');
    } else {
      setInvoices([...invoices, newInvoice]);
      handleShowNotification('Thêm hóa đơn thành công!', 'success');
    }
    closeAddEditModal();
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsConfirmingDelete(true);
  };

  const confirmDelete = () => {
    if (deleteModalRef.current) {
      gsap.to(deleteModalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete?.id));
          setIsConfirmingDelete(false);
          setItemToDelete(null);
          handleShowNotification('Đã xoá hóa đơn thành công!', 'success');
        },
      });
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

  const sortInvoices = (key: keyof Invoice) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (!sortConfig) return 0;
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

  const filteredInvoices = sortedInvoices.filter((invoice) =>
    Object.values(invoice).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleHideNotification}
        />
      )}

      <div
        ref={pageRef}
        className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
      >
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý hóa đơn</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={16} /> Thêm hóa đơn
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th
                  onClick={() => sortInvoices('id')}
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Mã Hóa Đơn <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => sortInvoices('customer')}
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Tên Khách Hàng <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">SĐT</th>
                <th
                  onClick={() => sortInvoices('date')}
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Ngày <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => sortInvoices('total')}
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Tổng Tiền <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Trạng Thái</th>
                <th className="px-6 py-3 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{inv.id}</td>
                    <td className="px-6 py-4">{inv.customer}</td>
                    <td className="px-6 py-4">{inv.phone}</td>
                    <td className="px-6 py-4">{formatDate(inv.date)}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'Đã thanh toán'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(inv)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(inv)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setShowDetail(inv)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          title="Chi tiết"
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && (
        <InvoiceDetailModal
          invoice={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}

      {showAddEditModal && (
        <AddEditInvoiceModal
          ref={addEditModalRef}
          invoice={currentEditInvoice}
          onSave={handleSaveInvoice}
          onClose={closeAddEditModal}
        />
      )}

      {isConfirmingDelete && (
        <ConfirmationModal
          ref={deleteModalRef}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Xác nhận xoá hóa đơn"
          message="Bạn có chắc chắn muốn xoá hóa đơn này? Thao tác này không thể hoàn tác."
          confirmText="Xoá"
          cancelText="Huỷ"
          color="red"
        />
      )}
    </div>
  );
};

const InvoiceDetailModal = ({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 }
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
          Chi tiết hóa đơn {invoice.id}
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Tên khách hàng:</strong> {invoice.customer}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {invoice.phone}
          </p>
          <p>
            <strong>Ngày:</strong> {formatDate(invoice.date)}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{' '}
            <span className="font-semibold text-green-600">
              {formatCurrency(invoice.total)}
            </span>
          </p>
          <p>
            <strong>Trạng thái:</strong>{' '}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                invoice.status === 'Đã thanh toán'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {invoice.status}
            </span>
          </p>
          {invoice.items && (
            <div className="mt-4">
              <h3 className="font-bold text-lg mb-2">Sản phẩm:</h3>
              <ul className="space-y-2">
                {invoice.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

interface AddEditInvoiceModalProps {
  invoice: Invoice | null;
  onSave: (newInvoice: Invoice) => void;
  onClose: () => void;
}

const AddEditInvoiceModal = React.forwardRef<
  HTMLDivElement,
  AddEditInvoiceModalProps
>(({ invoice, onSave, onClose }, ref) => {
  const [formData, setFormData] = useState<Invoice>(
    invoice || ({} as Invoice)
  );

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      gsap.fromTo(
        ref.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 }
      );
    }
  }, [ref]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.customer && formData.phone) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={ref}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
          {invoice?.id ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn mới'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Mã hóa đơn</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">
              Tên khách hàng
            </label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Tổng tiền</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Đã thanh toán</option>
              <option>Chưa thanh toán</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
          >
            <Save size={16} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
});
AddEditInvoiceModal.displayName = 'AddEditInvoiceModal';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  color: 'red' | 'yellow';
}

const ConfirmationModal = React.forwardRef<
  HTMLDivElement,
  ConfirmationModalProps
>(
  (
    { onConfirm, onCancel, title, message, confirmText, cancelText, color },
    ref
  ) => {
    const isRed = color === 'red';
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
        <div
          ref={ref}
          className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-md mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`p-4 rounded-full ${
                isRed ? 'bg-red-100' : 'bg-amber-100'
              }`}
            >
              <Info
                size={28}
                className={isRed ? 'text-red-600' : 'text-amber-600'}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">{title}</h3>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow transition-all duration-200 transform hover:scale-105 ${
                isRed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
ConfirmationModal.displayName = 'ConfirmationModal';

export default InvoiceManagement;
