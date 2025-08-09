"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import Link from "next/link";
import { Plus, User, Award, Calendar, Phone, Info, Eye, EyeOff, Search } from "lucide-react";
import gsap from "gsap";
import Notification from "@/components/Notification";

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

type Staff = {
  id: number;
  staffCode: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  createdAt: string;
  password: string;
};

const initialStaffList: Staff[] = [
  {
    id: 1,
    staffCode: "NV001",
    name: "Nguyễn Văn A",
    position: "Quản lý",
    phone: "0123456789",
    email: "a@example.com",
    birthday: "1990-01-01",
    gender: "Nam",
    createdAt: "2025-07-30 12:00:00",
    password: "123456",
  },
  {
    id: 2,
    staffCode: "NV002",
    name: "Trần Thị B",
    position: "Nhân viên",
    phone: "0987654321",
    email: "b@example.com",
    birthday: "1992-03-14",
    gender: "Nữ",
    createdAt: "2025-07-30 12:30:00",
    password: "123456",
  },
  {
    id: 3,
    staffCode: "NV003",
    name: "Lê Văn C",
    position: "Bảo vệ",
    phone: "0911223344",
    email: "c@example.com",
    birthday: "1988-06-20",
    gender: "Nam",
    createdAt: "2025-07-30 13:00:00",
    password: "123456",
  },
  {
    id: 4,
    staffCode: "NV004",
    name: "Phạm Thị D",
    position: "Thu ngân",
    phone: "0922334455",
    email: "d@example.com",
    birthday: "1995-11-11",
    gender: "Nữ",
    createdAt: "2025-07-30 13:30:00",
    password: "123456",
  },
  {
    id: 5,
    staffCode: "NV005",
    name: "Đỗ Minh E",
    position: "Nhân viên",
    phone: "0933445566",
    email: "e@example.com",
    birthday: "1993-04-25",
    gender: "Nam",
    createdAt: "2025-07-30 14:00:00",
    password: "123456",
  },
  {
    id: 6,
    staffCode: "NV006",
    name: "Hoàng Thị F",
    position: "Nhân viên",
    phone: "0944556677",
    email: "f@example.com",
    birthday: "1996-08-19",
    gender: "Nữ",
    createdAt: "2025-07-30 14:30:00",
    password: "123456",
  },
  {
    id: 7,
    staffCode: "NV007",
    name: "Ngô Văn G",
    position: "Kỹ thuật",
    phone: "0955667788",
    email: "g@example.com",
    birthday: "1987-12-01",
    gender: "Nam",
    createdAt: "2025-07-30 15:00:00",
    password: "123456",
  },
  {
    id: 8,
    staffCode: "NV008",
    name: "Vũ Thị H",
    position: "Lễ tân",
    phone: "0966778899",
    email: "h@example.com",
    birthday: "1998-01-09",
    gender: "Nữ",
    createdAt: "2025-07-30 15:30:00",
    password: "123456",
  },
  {
    id: 9,
    staffCode: "NV009",
    name: "Bùi Văn I",
    position: "Tạp vụ",
    phone: "0977889900",
    email: "i@example.com",
    birthday: "1980-10-15",
    gender: "Nam",
    createdAt: "2025-07-30 16:00:00",
    password: "123456",
  },
  {
    id: 10,
    staffCode: "NV010",
    name: "Trịnh Thị K",
    position: "Nhân viên",
    phone: "0988990011",
    email: "k@example.com",
    birthday: "1994-07-07",
    gender: "Nữ",
    createdAt: "2025-07-30 16:30:00",
    password: "123456",
  },
];

const positions = ["Quản lý", "Nhân viên", "Thu ngân", "Bảo vệ", "Kỹ thuật", "Lễ tân", "Tạp vụ"];
const genders = ["Nam", "Nữ", "Khác"];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });
  
  const [newUser, setNewUser] = useState<Omit<Staff, "id" | "createdAt"> & { password: string }>({
    staffCode: "",
    name: "",
    position: "Nhân viên",
    phone: "",
    email: "",
    birthday: "",
    gender: "Nam",
    password: "",
  });

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
  const [autoPassword, setAutoPassword] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const mainContentRef = useRef(null);
  const addModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (showModal) {
        gsap.fromTo(addModalRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    }
  }, [showModal]);

  const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => handleHideNotification(), 3000);
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setIsFormDirty(true);
    if (error) setError('');
  };

  const handleCloseModal = () => {
    if (isFormDirty) {
      setIsConfirmingCancel(true);
    } else {
      setShowModal(false);
      resetForm();
    }
  };

  const confirmCancel = () => {
    gsap.to(cancelModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingCancel(false);
        setShowModal(false);
        resetForm();
      },
    });
  };

  const cancelConfirm = () => {
    gsap.to(cancelModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingCancel(false);
      },
    });
  };

  const resetForm = () => {
    setNewUser({
      staffCode: "",
      name: "",
      phone: "",
      email: "",
      position: "Nhân viên",
      password: "",
      birthday: "",
      gender: "Nam",
    });
    setAutoPassword(false);
    setIsFormDirty(false);
    setError("");
  };

  const handleAddStaff = () => {
    const { name, phone, email, position, password, gender, birthday } = newUser;

    if (!name || !phone || !email || !position || !password || !birthday || !gender) {
      setError("Vui lòng nhập đầy đủ thông tin, bao gồm mật khẩu.");
      return;
    }

    const newStaffCode = `NV${String(staffList.length + 1).padStart(3, '0')}`;
    const createdAt = new Date().toLocaleString("sv-SE", {
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
    });

    const newStaffMember: Staff = {
        id: staffList.length + 1,
        staffCode: newStaffCode,
        name,
        phone,
        email,
        position,
        birthday,
        gender,
        createdAt,
        password,
    };
    
    setStaffList([...staffList, newStaffMember]);
    setShowModal(false);
    resetForm();
    handleShowNotification(`Đã thêm nhân viên ${name} thành công!`, 'success');
  };

  const handleAutoPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoPassword(checked);
    setNewUser({
      ...newUser,
      password: checked ? generateRandomPassword() : "",
    });
    setIsFormDirty(true);
  };
  
  const filteredStaffList = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.staffCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
      {notification.visible && <Notification message={notification.message} type={notification.type} onClose={handleHideNotification} />}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Quản lý nhân viên
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            <Plus size={16} /> Thêm nhân viên
          </button>
        </div>
      </div>

      <div ref={mainContentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaffList.length > 0 ? (
          filteredStaffList.map((staff) => (
            <Link
              key={staff.id}
              href={`/staff/${staff.id}`}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500 rounded-full text-white">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.position}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-blue-500" />
                    <span className="font-medium">Mã NV:</span> {staff.staffCode}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" />
                    <span className="font-medium">SĐT:</span> {staff.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="font-medium">Ngày sinh:</span> {formatDate(staff.birthday)}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
            <p>Không tìm thấy nhân viên nào phù hợp.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
          <div
            ref={addModalRef}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Thêm nhân viên mới
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Họ và tên", type: "text" },
                { name: "staffCode", label: "Mã nhân viên (Tự động)", type: "text", disabled: true, value: `NV${String(staffList.length + 1).padStart(3, '0')}` },
                { name: "phone", label: "Số điện thoại", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "position", label: "Chức vụ", type: "select", options: positions },
                { name: "gender", label: "Giới tính", type: "select", options: genders },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={(newUser as any)[field.name]}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.name === "staffCode" ? field.value : (newUser as any)[field.name]}
                      onChange={handleFormChange}
                      disabled={field.disabled}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white border-gray-300"}`}
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  max={today}
                  value={newUser.birthday}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    value={newUser.password}
                    onChange={handleFormChange}
                    disabled={autoPassword}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${error.includes("mật khẩu") ? "border-red-500" : "border-gray-300"}`}
                  />
                  {!autoPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="autoPassword"
                        checked={autoPassword}
                        onChange={handleAutoPasswordChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="autoPassword" className="text-sm text-gray-700">Tạo mật khẩu ngẫu nhiên</label>
                    {autoPassword && <span className="text-sm text-gray-500 font-mono">({newUser.password})</span>}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Huỷ
              </button>
              <button
                onClick={handleAddStaff}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmingCancel && (
        <ConfirmationModal
          ref={cancelModalRef}
          onConfirm={confirmCancel}
          onCancel={cancelConfirm}
          title="Huỷ thêm nhân viên"
          message="Bạn có chắc muốn huỷ? Mọi thông tin đã nhập sẽ bị xoá."
          confirmText="Huỷ"
          cancelText="Tiếp tục chỉnh sửa"
          color="yellow"
        />
      )}
    </div>
  );
}