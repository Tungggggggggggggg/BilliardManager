"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Award,
  Edit,
  Trash2,
  X,
  Info,
  ArrowLeft,
  Save,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import gsap from "gsap";
import Notification from "@/components/Notification";

interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

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
  password?: string;
};

const staffList: Staff[] = [
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

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  const [date, time] = dateTimeString.split(' ');
  return `${time.substring(0, 5)} ${formatDate(date)}`;
};

export default function StaffDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const currentStaff = staffList.find((s) => s.id === Number(id));

  const [staff, setStaff] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Staff | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });

  const detailRef = useRef(null);
  const deleteModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    if (currentStaff) {
      setStaff(currentStaff);
      setEditData(currentStaff);
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [currentStaff]);

  const positions = ["Quản lý", "Nhân viên", "Thu ngân", "Bảo vệ", "Kỹ thuật", "Lễ tân", "Tạp vụ"];
  const genders = ["Nam", "Nữ", "Khác"];

  const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ visible: true, message, type });
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const handleDelete = () => {
    setIsConfirmingDelete(true);
  };

  const confirmDelete = () => {
    gsap.to(deleteModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingDelete(false);
        handleShowNotification('Đã xoá nhân viên thành công!', 'success');
        setTimeout(() => {
          router.push("/staff");
        }, 1500);
      },
    });
  };

  const cancelDelete = () => {
    gsap.to(deleteModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingDelete(false);
      },
    });
  };

  const handleOpenEdit = () => {
    if (staff) {
        setEditData({ ...staff });
        setIsEditing(true);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    if (JSON.stringify(editData) !== JSON.stringify(staff)) {
      setIsConfirmingCancel(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmCancelEdit = () => {
    gsap.to(cancelModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingCancel(false);
        setIsEditing(false);
      },
    });
  };

  const cancelConfirmCancel = () => {
    gsap.to(cancelModalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsConfirmingCancel(false);
      },
    });
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    setStaff(editData);
    setIsEditing(false);
    handleShowNotification('Đã cập nhật thông tin!', 'success');
  };

  if (!staff) return <div className="p-6">Không tìm thấy nhân viên</div>;

  return (
    <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
        {notification.visible && <Notification message={notification.message} type={notification.type} onClose={handleHideNotification} />}

        <div ref={detailRef} className="bg-white rounded-2xl shadow-xl p-8 space-y-4 border">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Chi tiết nhân viên #{staff.id}
                    </h1>
                </div>
                <div className="flex gap-4">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={handleOpenEdit}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
                            >
                                <Edit size={16} /> Chỉnh sửa
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
                            >
                                <Trash2 size={16} /> Xoá
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
                            >
                                <X size={16} /> Huỷ
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-300 transform hover:scale-105"
                            >
                                <Save size={16} /> Lưu
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableInfoCard
                    label="Mã nhân viên"
                    name="staffCode"
                    value={staff.staffCode}
                    icon={User}
                    isEditing={isEditing}
                    editValue={editData?.staffCode || ""}
                    onEditChange={handleEditChange}
                />
                <EditableInfoCard
                    label="Họ và tên"
                    name="name"
                    value={staff.name}
                    icon={User}
                    isEditing={isEditing}
                    editValue={editData?.name || ""}
                    onEditChange={handleEditChange}
                />
                <EditableInfoCard
                    label="Giới tính"
                    name="gender"
                    value={staff.gender}
                    icon={Info}
                    isEditing={isEditing}
                    editValue={editData?.gender || ""}
                    onEditChange={handleEditChange}
                    type="select"
                    options={genders}
                />
                <EditableInfoCard
                    label="Ngày sinh"
                    name="birthday"
                    value={formatDate(staff.birthday)}
                    icon={Calendar}
                    isEditing={isEditing}
                    editValue={editData?.birthday || ""}
                    onEditChange={handleEditChange}
                    type="date"
                />
                <EditableInfoCard
                    label="Chức vụ"
                    name="position"
                    value={staff.position}
                    icon={Award}
                    isEditing={isEditing}
                    editValue={editData?.position || ""}
                    onEditChange={handleEditChange}
                    type="select"
                    options={positions}
                />
                <EditableInfoCard
                    label="Thời gian vào làm"
                    name="createdAt"
                    value={formatDateTime(staff.createdAt)}
                    icon={Calendar}
                    isEditing={isEditing}
                    editValue={editData?.createdAt.substring(0, 10) || ""}
                    onEditChange={handleEditChange}
                    type="date"
                />
                <EditableInfoCard
                    label="Số điện thoại"
                    name="phone"
                    value={staff.phone}
                    icon={Phone}
                    isEditing={isEditing}
                    editValue={editData?.phone || ""}
                    onEditChange={handleEditChange}
                    type="text"
                />
                <EditableInfoCard
                    label="Email"
                    name="email"
                    value={staff.email}
                    icon={Mail}
                    isEditing={isEditing}
                    editValue={editData?.email || ""}
                    onEditChange={handleEditChange}
                    type="email"
                />
                <EditableInfoCard
                    label="Mật khẩu"
                    name="password"
                    value={showPassword ? staff.password || "" : "********"}
                    icon={Lock}
                    isEditing={isEditing}
                    editValue={editData?.password || ""}
                    onEditChange={handleEditChange}
                    type={showPassword ? "text" : "password"}
                    toggleVisibility={() => setShowPassword(!showPassword)}
                    showPassword={showPassword}
                />
            </div>
        </div>

        {isConfirmingDelete && (
            <ConfirmationModal
                ref={deleteModalRef}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                title="Xác nhận xoá nhân viên"
                message="Bạn có chắc chắn muốn xoá nhân viên này? Thao tác này không thể hoàn tác."
                confirmText="Xoá"
                cancelText="Huỷ"
                color="red"
            />
        )}

        {isConfirmingCancel && (
            <ConfirmationModal
                ref={cancelModalRef}
                onConfirm={confirmCancelEdit}
                onCancel={cancelConfirmCancel}
                title="Huỷ chỉnh sửa"
                message="Bạn có chắc muốn huỷ chỉnh sửa? Mọi thay đổi sẽ không được lưu."
                confirmText="Huỷ chỉnh sửa"
                cancelText="Tiếp tục chỉnh sửa"
                color="yellow"
            />
        )}
    </div>
  );
}

interface EditableInfoCardProps {
  label: string;
  name: string;
  value: React.ReactNode;
  icon: React.ElementType;
  isEditing: boolean;
  editValue: string | number;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  options?: string[];
  toggleVisibility?: () => void;
  showPassword?: boolean;
}

function EditableInfoCard({
  label,
  name,
  value,
  icon: Icon,
  isEditing,
  editValue,
  onEditChange,
  type = "text",
  options = [],
  toggleVisibility,
  showPassword = false,
}: EditableInfoCardProps) {
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${isEditing ? "bg-blue-50 border-blue-200" : "bg-gray-50 hover:shadow-md"}`}>
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2 bg-gray-200 rounded-full">
          <Icon size={20} className="text-gray-600" />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      {isEditing ? (
        <div className="relative">
          {type === "select" ? (
            <select
              name={name}
              value={editValue}
              onChange={onEditChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={editValue}
              onChange={onEditChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          )}
          {name === "password" && toggleVisibility && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800 px-4 py-2 block">
            {value}
          </span>
          {name === "password" && toggleVisibility && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="text-sm text-blue-600 hover:underline"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
          )}
        </div>
      )}
    </div>
  );
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

const ConfirmationModal = React.forwardRef<
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