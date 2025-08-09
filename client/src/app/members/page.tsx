"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Plus, User, Award, Phone, X, Search} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import Notification from "@/components/Notification";
import { Info } from "lucide-react";

interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  color: "red" | "yellow";
}

const ConfirmationModal = forwardRef<
  HTMLDivElement,
  ConfirmationModalProps
>(
  (
    { onConfirm, onCancel, title, message, confirmText, cancelText, color },
    ref
  ) => {
    const isRed = color === "red";
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
        <div ref={ref} className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-md mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-full ${isRed ? "bg-red-100" : "bg-amber-100"}`}>
              <Info size={28} className={isRed ? "text-red-600" : "text-amber-600"} />
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
                isRed ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
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

ConfirmationModal.displayName = "ConfirmationModal";

const rankBySpending = (amount: number) => {
  if (amount >= 10000000) return "Vàng";
  if (amount >= 5000000) return "Bạc";
  return "Đồng";
};

const rankColor = (amount: number) => {
  if (amount >= 10000000) return "text-amber-500";
  if (amount >= 5000000) return "text-slate-500";
  return "text-yellow-800";
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

interface MemberData {
  member_id: number;
  full_name: string;
  gender: string;
  birthdate: string;
  phone: string;
  email: string;
  total_spent: number;
  join_date: string;
}

const initialMembers: MemberData[] = [
  {
    member_id: 1,
    full_name: "Nguyễn Văn A",
    gender: "Nam",
    birthdate: "1990-01-01",
    phone: "0123456789",
    email: "a@example.com",
    total_spent: 7200000,
    join_date: "2023-05-10",
  },
  {
    member_id: 2,
    full_name: "Trần Thị B",
    gender: "Nữ",
    birthdate: "1995-07-15",
    phone: "0987654321",
    email: "b@example.com",
    total_spent: 12000000,
    join_date: "2022-10-03",
  },
  {
    member_id: 3,
    full_name: "Lê Văn C",
    gender: "Nam",
    birthdate: "1988-03-20",
    phone: "0901234567",
    email: "c@example.com",
    total_spent: 3400000,
    join_date: "2023-01-22",
  },
  {
    member_id: 4,
    full_name: "Phạm Thị D",
    gender: "Nữ",
    birthdate: "1992-09-10",
    phone: "0976543210",
    email: "d@example.com",
    total_spent: 5100000,
    join_date: "2023-08-01",
  },
  {
    member_id: 5,
    full_name: "Hoàng Văn E",
    gender: "Nam",
    birthdate: "1985-12-12",
    phone: "0911223344",
    email: "e@example.com",
    total_spent: 9500000,
    join_date: "2024-03-17",
  },
  {
    member_id: 6,
    full_name: "Đỗ Thị F",
    gender: "Nữ",
    birthdate: "1999-11-11",
    phone: "0900112233",
    email: "f@example.com",
    total_spent: 2000000,
    join_date: "2024-01-05",
  },
  {
    member_id: 7,
    full_name: "Ngô Văn G",
    gender: "Nam",
    birthdate: "1980-04-18",
    phone: "0933344556",
    email: "g@example.com",
    total_spent: 10000000,
    join_date: "2023-11-20",
  },
  {
    member_id: 8,
    full_name: "Trịnh Thị H",
    gender: "Nữ",
    birthdate: "1993-06-06",
    phone: "0911225566",
    email: "h@example.com",
    total_spent: 4800000,
    join_date: "2023-06-30",
  },
  {
    member_id: 9,
    full_name: "Bùi Văn I",
    gender: "Nam",
    birthdate: "1987-08-25",
    phone: "0900778899",
    email: "i@example.com",
    total_spent: 3000000,
    join_date: "2024-05-05",
  },
  {
    member_id: 10,
    full_name: "Nguyễn Thị J",
    gender: "Nữ",
    birthdate: "1996-02-14",
    phone: "0922334455",
    email: "j@example.com",
    total_spent: 12500000,
    join_date: "2023-09-09",
  },
];

const isValidDate = (dateString: string) => {
  if (!dateString) return false;
  const [year, month, day] = dateString.split('-').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export default function MemberPage() {
  const [members, setMembers] = useState<MemberData[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Nam",
    birthdate: "",
    phone: "",
    email: "",
    total_spent: 0,
  });
  const [unsaved, setUnsaved] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });

  const modalRef = useRef<HTMLDivElement>(null);
  const pageContentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      pageContentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ visible: false, message: '', type: 'info' }), 3000);
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const handleAddMember = () => {
    const { full_name, phone, email, birthdate } = formData;

    if (!full_name || !phone || !email || !birthdate) {
      handleShowNotification('Vui lòng nhập đầy đủ thông tin hội viên!', 'error');
      return;
    }

    if (!isValidDate(birthdate)) {
      handleShowNotification('Ngày sinh không hợp lệ. Vui lòng kiểm tra lại!', 'error');
      return;
    }

    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setMembers((prev) => [
          ...prev,
          {
            member_id: Date.now(),
            ...formData,
            join_date: getToday(),
          },
        ]);
        setShowModal(false);
        setUnsaved(false);
        setFormData({
          full_name: "",
          gender: "Nam",
          birthdate: "",
          phone: "",
          email: "",
          total_spent: 0,
        });
        handleShowNotification('Đã thêm hội viên mới!', 'success');
      },
    });
  };

  const handleOpenModal = () => {
    setShowModal(true);
    gsap.fromTo(
      modalRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  };

  const handleCloseModal = () => {
    if (unsaved) {
      setShowConfirmModal(true);
      gsap.to(modalRef.current, {
        scale: 0.95, opacity: 0.8, duration: 0.2, ease: "power2.out"
      });
      return;
    }
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setShowModal(false);
        setUnsaved(false);
        setFormData({
          full_name: "",
          gender: "Nam",
          birthdate: "",
          phone: "",
          email: "",
          total_spent: 0,
        });
      },
    });
  };

  const confirmCloseModal = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setShowModal(false);
        setShowConfirmModal(false);
        setUnsaved(false);
        setFormData({
          full_name: "",
          gender: "Nam",
          birthdate: "",
          phone: "",
          email: "",
          total_spent: 0,
        });
      },
    });
  };

  const cancelCloseModal = () => {
    setShowConfirmModal(false);
    gsap.to(modalRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setUnsaved(true);
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
      {notification.visible && <Notification message={notification.message} type={notification.type} onClose={handleHideNotification} />}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Quản lý hội viên
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm hội viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            <Plus size={16} /> Thêm hội viên
          </button>
        </div>
      </div>

      <div ref={pageContentRef} className="bg-white shadow-xl rounded-2xl overflow-hidden border">
        <table className="min-w-full text-lg">
          <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-4 min-w-[220px] text-left">Tên</th>
              <th className="p-4 min-w-[180px] text-left">Số điện thoại</th>
              <th className="p-4 min-w-[140px] text-left">Hạng</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.member_id}
                  className="member-row hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      {member.full_name}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    {member.phone}
                  </td>
                  <td className={`p-4 font-bold ${rankColor(member.total_spent)}`}>
                    <div className="flex items-center gap-2">
                      <Award size={16} />
                      {rankBySpending(member.total_spent)}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/members/${member.member_id}`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors transform hover:scale-105"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  Không tìm thấy hội viên nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>
          <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors"
                onClick={handleCloseModal}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
                Thêm hội viên
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <input
                    type="text"
                    name="full_name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select
                    name="gender"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="birthdate"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.birthdate}
                    onChange={handleChange}
                    max={today}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full text-lg font-semibold shadow transition-all duration-300 transform hover:scale-105"
                onClick={handleAddMember}
              >
                Lưu
              </button>
            </div>
          </div>
        </>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          onConfirm={confirmCloseModal}
          onCancel={cancelCloseModal}
          title="Huỷ thao tác"
          message="Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ bị mất."
          confirmText="Có, Huỷ"
          cancelText="Không"
          color="yellow"
        />
      )}
    </div>
  );
}