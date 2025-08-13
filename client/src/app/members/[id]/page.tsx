"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDateTime } from "@/lib/formatDateTime";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Edit,
  Trash2,
  X,
  Info,
  ArrowLeft,
  Save,
} from "lucide-react";
import gsap from "gsap";
import Notification from "@/components/Notification";

const rankDetails = (point: number) => {
  if (point >= 10000000)
    return {
      name: "Vàng",
      color: "text-amber-500",
      icon: "🥇",
      bg: "bg-amber-500/10",
    };
  if (point >= 5000000)
    return {
      name: "Bạc",
      color: "text-slate-500",
      icon: "🥈",
      bg: "bg-slate-500/10",
    };
  return {
    name: "Đồng",
    color: "text-yellow-800",
    icon: "🥉",
    bg: "bg-yellow-800/10",
  };
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

interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function formatDateDDMMYYYY(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}






export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentMember, setCurrentMember] = useState<MemberData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<MemberData | null>(null);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const detailRef = useRef(null);
  const deleteModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/members/${id}`)
      .then(res => setCurrentMember(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          handleShowNotification('Không tìm thấy hội viên!', 'error');
        } else {
          console.error('API error:', err);
          handleShowNotification('Lỗi khi tải dữ liệu hội viên!', 'error');
        }
      });
    gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [id]);

  const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ visible: true, message, type });
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const handleOpenEdit = () => {
    if (currentMember) {
      setEditData({
      ...currentMember,
      birthdate: currentMember.birthdate
        ? currentMember.birthdate
        : ''
    });
      setIsEditing(true);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value } as MemberData);
  };

  const handleCancelEdit = () => {
    if (!editData || !currentMember) {
      setIsEditing(false);
      return;
    }
    const isChanged = JSON.stringify(editData) !== JSON.stringify(currentMember);
    if (isChanged) {
      setIsConfirmingCancel(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSaveEdit = async () => {
  if (!editData) return;
  try {
    // Tạo object chỉ chứa các field cần cập nhật
    const updatedData = {
      member_id: editData.member_id,
      full_name: editData.full_name,
      gender: editData.gender,
      birthdate: editData.birthdate,
      phone: editData.phone,
      email: editData.email,
      total_spent: editData.total_spent,
    };

    await api.put(`/members/${id}`, updatedData);
    setCurrentMember({
      ...currentMember!,
      ...updatedData,
    });
    setIsEditing(false);
    handleShowNotification('Đã cập nhật thông tin hội viên!', 'success');
  } catch (err) {
    console.error('API error:', err);
    handleShowNotification('Lỗi khi cập nhật hội viên!', 'error');
  }
};


  const handleDelete = () => {
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/members/${id}`);
      gsap.to(deleteModalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setIsConfirmingDelete(false);
          handleShowNotification('Đã xoá hội viên thành công!', 'success');
          setTimeout(() => {
            router.push("/members");
          }, 1500);
        },
      });
    } catch (err) {
      console.error('API error:', err);
      handleShowNotification('Lỗi khi xoá hội viên!', 'error');
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

  const rank = currentMember ? rankDetails(currentMember.total_spent) : null;

  if (!currentMember) {
    return (
      <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border text-center text-gray-500">
          Đang tải dữ liệu hội viên...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-screen-xl mx-auto">
      {notification.visible && <Notification message={notification.message} type={notification.type} onClose={handleHideNotification} />}

      <div
        ref={detailRef}
        className="bg-white rounded-2xl shadow-xl p-8 space-y-4 border"
      >
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Chi tiết hội viên
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
            label="Họ tên"
            name="full_name"
            value={currentMember.full_name}
            icon={User}
            isEditing={isEditing}
            editValue={editData?.full_name || ''}
            onEditChange={handleEditChange}
          />
          <EditableInfoCard
            label="Giới tính"
            name="gender"
            value={currentMember.gender}
            icon={Info}
            isEditing={isEditing}
            editValue={editData?.gender || ''}
            onEditChange={handleEditChange}
            type="select"
          />
          <EditableInfoCard
          label="Ngày sinh"
          name="birthdate"
          value={formatDateDDMMYYYY(currentMember.birthdate)} // chỉ để xem
          icon={Calendar}
          isEditing={isEditing}
          editValue={
            editData?.birthdate
  ? new Date(editData.birthdate).toISOString().split('T')[0]
    : ''
          }
          onEditChange={handleEditChange}
          type="date"
        />
          <EditableInfoCard
            label="Số điện thoại"
            name="phone"
            value={currentMember.phone}
            icon={Phone}
            isEditing={isEditing}
            editValue={editData?.phone || ''}
            onEditChange={handleEditChange}
          />
          <EditableInfoCard
            label="Email"
            name="email"
            value={currentMember.email}
            icon={Mail}
            isEditing={isEditing}
            editValue={editData?.email || ''}
            onEditChange={handleEditChange}
          />
          <MemberInfoCard
            label="Ngày tham gia"
            value={formatDateDDMMYYYY(currentMember.join_date)}
            icon={Calendar}
          />
          <MemberInfoCard
            label="Hạng hội viên"
            value={
              rank && (
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${rank.bg} ${rank.color}`}
                >
                  <Award size={16} />
                  {rank.name}
                </span>
              )
            }
            icon={Award}
          />
          <EditableInfoCard
            label="Điểm tích luỹ"
            name="total_spent"
            value={currentMember.total_spent.toLocaleString("vi-VN") + " VND"}
            icon={DollarSign}
            isEditing={isEditing}
            editValue={editData?.total_spent || 0}
            onEditChange={handleEditChange}
            type="number"
          />
        </div>
      </div>

      {isConfirmingDelete && (
        <ConfirmationModal
          ref={deleteModalRef}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Xác nhận xoá hội viên"
          message="Bạn có chắc chắn muốn xoá hội viên này? Thao tác này không thể hoàn tác."
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

function MemberInfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-gray-50 rounded-lg px-6 py-4 border flex items-center justify-between transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-200 rounded-full">
          <Icon size={20} className="text-gray-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">{label}</span>
          <span className="text-base font-semibold text-gray-800">
            {value}
          </span>
        </div>
      </div>
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
}: EditableInfoCardProps) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${isEditing ? "bg-blue-50 border-blue-200" : "bg-gray-50 hover:shadow-md"}`}>
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2 bg-gray-200 rounded-full">
          <Icon size={20} className="text-gray-600" />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      {isEditing ? (
        type === "select" ? (
          <select
            name={name}
            value={editValue}
            onChange={onEditChange}
            
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={editValue}
            onChange={onEditChange}
            max={type === "date" ? today : undefined}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        )
      ) : (
        <span className="text-base font-semibold text-gray-800 px-4 py-2 block">
          {value}
        </span>
      )}
    </div>
  );
}


