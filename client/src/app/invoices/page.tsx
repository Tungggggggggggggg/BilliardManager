'use client';

import { useState } from 'react';
import { Plus, Info } from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 'HD001',
      customer: 'Nguyễn Văn A',
      phone: '0123456789',
      date: '02/08/2025',
      total: 350000,
      status: 'Đã thanh toán',
    },
  ]);

  const [showDetail, setShowDetail] = useState(null);

  const addInvoice = () => {
    const newId = `HD00${invoices.length + 1}`;
    setInvoices([
      ...invoices,
      {
        id: newId,
        customer: '',
        phone: '',
        date: '',
        total: 0,
        status: 'Chưa thanh toán',
        editable: true,
      },
    ]);
  };

  const updateInvoice = (index, field, value) => {
    const updated = [...invoices];
    updated[index][field] = value;
    setInvoices(updated);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Quản lý hóa đơn</h1>
        <button
          onClick={addInvoice}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus className="inline-block mr-1" size={18} /> Thêm hóa đơn
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Mã Hóa Đơn</th>
              <th className="px-6 py-3 text-left">Tên Khách</th>
              <th className="px-6 py-3 text-left">SĐT</th>
              <th className="px-6 py-3 text-left">Ngày</th>
              <th className="px-6 py-3 text-left">Tổng Tiền</th>
              <th className="px-6 py-3 text-left">Trạng Thái</th>
              <th className="px-6 py-3 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv.id} className="border-t">
                <td className="px-6 py-4">{inv.id}</td>
                <td className="px-6 py-4">
                  {inv.editable ? (
                    <input
                      type="text"
                      value={inv.customer}
                      onChange={(e) => updateInvoice(idx, 'customer', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    inv.customer
                  )}
                </td>
                <td className="px-6 py-4">
                  {inv.editable ? (
                    <input
                      type="text"
                      value={inv.phone}
                      onChange={(e) => updateInvoice(idx, 'phone', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    inv.phone
                  )}
                </td>
                <td className="px-6 py-4">
                  {inv.editable ? (
                    <input
                      type="date"
                      value={inv.date}
                      onChange={(e) => updateInvoice(idx, 'date', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    inv.date
                  )}
                </td>
                <td className="px-6 py-4 text-green-600 font-semibold">
                  {inv.editable ? (
                    <input
                      type="number"
                      value={inv.total}
                      onChange={(e) => updateInvoice(idx, 'total', +e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    formatCurrency(inv.total)
                  )}
                </td>
                <td className="px-6 py-4 text-green-600">
                  {inv.status}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setShowDetail(inv)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Info size={16} className="inline mr-1" /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Chi tiết hóa đơn</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Mã:</strong> {showDetail.id}</li>
              <li><strong>Khách:</strong> {showDetail.customer}</li>
              <li><strong>Điện thoại:</strong> {showDetail.phone}</li>
              <li><strong>Ngày:</strong> {showDetail.date}</li>
              <li><strong>Tổng tiền:</strong> {formatCurrency(showDetail.total)}</li>
              <li><strong>Trạng thái:</strong> {showDetail.status}</li>
            </ul>
            <button
              onClick={() => setShowDetail(null)}
              className="mt-6 w-full bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

export default InvoiceManagement;