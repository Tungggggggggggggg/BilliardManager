"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StaffDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [staff, setStaff] = useState({
    id,
    staffCode: "NV001",
    name: "Nguyễn Văn A",
    gender: "Nam",
    birthdate: "1995-05-10",
    position: "Quản lý",
    startDate: "2023-01-01",
    phone: "0123456789",
    email: "nva@example.com",
    password: "12345678",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...staff });
  const [showPassword, setShowPassword] = useState(false);

  const positions = ["Quản lý", "Nhân viên", "Thu ngân", "Bảo vệ"];
  const genders = ["Nam", "Nữ", "Khác"];

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xoá nhân viên này?")) {
      alert("Đã xoá nhân viên");
      router.push("/staff");
    }
  };

  const handleOpenEdit = () => {
    setEditData({ ...staff });
    setIsEditing(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    const isChanged = JSON.stringify(editData) !== JSON.stringify(staff);
    if (isChanged) {
      const confirmCancel = window.confirm(
        "Bạn có chắc muốn huỷ chỉnh sửa? Mọi thay đổi sẽ không được lưu."
      );
      if (!confirmCancel) return;
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setStaff({ ...editData });
    setIsEditing(false);
    alert("Đã cập nhật thông tin!");
  };

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết nhân viên #{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          <InfoRow label="Mã nhân viên" value={staff.staffCode} />
          <InfoRow label="Tên" value={staff.name} />
          <InfoRow label="Giới tính" value={staff.gender} />
          <InfoRow label="Ngày sinh" value={staff.birthdate} />
          <InfoRow label="Chức vụ" value={staff.position} />
          <InfoRow label="Thời gian vào làm" value={staff.startDate} />
          <InfoRow label="Số điện thoại" value={staff.phone} />
          <InfoRow label="Gmail" value={staff.email} />
          <InfoRow
            label="Mật khẩu"
            value={showPassword ? staff.password : "********"}
            trailing={
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            }
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
          >
            Xoá nhân viên
          </button>
          <button
            onClick={handleOpenEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
          >
            Chỉnh sửa
          </button>
        </div>

        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative">
              {/* Close button */}
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Chỉnh sửa thông tin nhân viên
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "staffCode", label: "Mã nhân viên", type: "text" },
                  { name: "name", label: "Tên", type: "text" },
                  { name: "gender", label: "Giới tính", type: "select", options: genders },
                  { name: "birthdate", label: "Ngày sinh", type: "date" },
                  { name: "position", label: "Chức vụ", type: "select", options: positions },
                  { name: "startDate", label: "Thời gian vào làm", type: "date" },
                  { name: "phone", label: "Số điện thoại", type: "text" },
                  { name: "email", label: "Gmail", type: "email" },
                  { name: "password", label: "Mật khẩu", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={(editData as any)[field.name]}
                        onChange={handleEditChange}
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
                        value={(editData as any)[field.name]}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 border flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span className="text-base font-semibold text-gray-800">{value}</span>
      </div>
      {trailing && <div className="ml-4">{trailing}</div>}
    </div>
  );
}
