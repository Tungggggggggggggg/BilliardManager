"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDateTime } from "@/lib/formatDateTime";
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
import api from "@/utils/api";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

type Staff = {
  id: number;
  staff_code: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  created_at: string;
  password?: string;
};




export default function StaffDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
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
    if (!id) return;
    api.get(`/staff/${id}`)
      .then(res => {
        setStaff(res.data);
        setEditData(res.data);
      })
      .catch(() => {
        setStaff(null);
        setEditData(null);
        handleShowNotification('Không tìm thấy nhân viên hoặc lỗi khi tải dữ liệu!', 'error');
      });
    if (detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [id]);

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

  const confirmDelete = async () => {
    try {
      await api.delete(`/staff/${id}`);
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
    } catch {
      handleShowNotification('Lỗi khi xoá nhân viên!', 'error');
    }
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

  const handleSaveEdit = async () => {
    if (!editData) return;
    try {
      const res = await api.put(`/staff/${id}`, editData);
      setStaff(res.data);
      setEditData(res.data);
      setIsEditing(false);
      handleShowNotification('Đã cập nhật thông tin!', 'success');
    } catch {
      handleShowNotification('Lỗi khi cập nhật nhân viên!', 'error');
    }
  };

  if (!staff) return <div className="p-6 text-red-600 font-semibold">Không tìm thấy nhân viên</div>;

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
            name="staff_code"
            value={staff.staff_code ? staff.staff_code : "Không có dữ liệu"}
            icon={User}
            isEditing={isEditing}
            editValue={editData?.staff_code || ""}
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
            value={formatDateTime(staff.birthday)}
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
            name="create_at"
            value={staff.created_at ? formatDateTime(staff.created_at) : "Không có dữ liệu"}
            icon={Calendar}
            isEditing={isEditing}
            editValue={editData?.created_at ? editData.created_at.substring(0, 10) : ""}
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

