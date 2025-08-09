"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};


export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const members = [
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

  const member =
    members.find((m) => m.member_id === parseInt(id as string)) || members[0];
  const [currentMember, setCurrentMember] = useState<MemberData>(member);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...member });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });

  const detailRef = useRef(null);
  const deleteModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleShowNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ visible: true, message, type });
  };

  const handleHideNotification = () => {
    setNotification({ visible: false, message: '', type: 'info' });
  };

  const handleOpenEdit = () => {
    setEditData({ ...currentMember });
    setIsEditing(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCancelEdit = () => {
    const isChanged = JSON.stringify(editData) !== JSON.stringify(currentMember);
    if (isChanged) {
      setIsConfirmingCancel(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSaveEdit = () => {
    setCurrentMember(editData);
    setIsEditing(false);
    handleShowNotification('Đã cập nhật thông tin hội viên!', 'success');
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
        handleShowNotification('Đã xoá hội viên thành công!', 'success');
        setTimeout(() => {
          router.push("/members");
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

  const rank = rankDetails(currentMember.total_spent);

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
            editValue={editData.full_name}
            onEditChange={handleEditChange}
          />
          <EditableInfoCard
            label="Giới tính"
            name="gender"
            value={currentMember.gender}
            icon={Info}
            isEditing={isEditing}
            editValue={editData.gender}
            onEditChange={handleEditChange}
            type="select"
          />
          <EditableInfoCard
            label="Ngày sinh"
            name="birthdate"
            value={formatDate(currentMember.birthdate)}
            icon={Calendar}
            isEditing={isEditing}
            editValue={editData.birthdate}
            onEditChange={handleEditChange}
            type="date"
          />
          <EditableInfoCard
            label="Số điện thoại"
            name="phone"
            value={currentMember.phone}
            icon={Phone}
            isEditing={isEditing}
            editValue={editData.phone}
            onEditChange={handleEditChange}
          />
          <EditableInfoCard
            label="Email"
            name="email"
            value={currentMember.email}
            icon={Mail}
            isEditing={isEditing}
            editValue={editData.email}
            onEditChange={handleEditChange}
          />
          <MemberInfoCard
            label="Ngày tham gia"
            value={formatDate(currentMember.join_date)} 
            icon={Calendar}
          />
          <MemberInfoCard
            label="Hạng hội viên"
            value={
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${rank.bg} ${rank.color}`}
              >
                <Award size={16} />
                {rank.name}
              </span>
            }
            icon={Award}
          />
          <EditableInfoCard
            label="Điểm tích luỹ"
            name="total_spent"
            value={currentMember.total_spent.toLocaleString("vi-VN") + " VND"}
            icon={DollarSign}
            isEditing={isEditing}
            editValue={editData.total_spent}
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
        <div
          ref={ref}
          className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-md mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`p-4 rounded-full ${
                isRed ? "bg-red-100" : "bg-amber-100"
              }`}
            >
              <Info
                size={28}
                className={isRed ? "text-red-600" : "text-amber-600"}
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
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
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