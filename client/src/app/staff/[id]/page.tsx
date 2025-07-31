"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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


export default function StaffDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const currentStaff = staffList.find((s) => s.id === Number(id));

  const [staff, setStaff] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Staff | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const positions = ["Quản lý", "Nhân viên", "Thu ngân", "Bảo vệ"];
  const genders = ["Nam", "Nữ", "Khác"];

  useEffect(() => {
    if (currentStaff) {
      setStaff(currentStaff);
      setEditData(currentStaff);
    }
  }, [currentStaff]);

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xoá nhân viên này?")) {
      alert("Đã xoá nhân viên");
      router.push("/staff");
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
      if (!window.confirm("Bạn có chắc muốn huỷ chỉnh sửa?")) return;
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    setStaff(editData);
    setIsEditing(false);
    alert("Đã cập nhật thông tin!");
  };

  if (!staff) return <div className="p-6">Không tìm thấy nhân viên</div>;

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết nhân viên #{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          <InfoRow label="Mã nhân viên" value={staff.staffCode} />
          <InfoRow label="Tên" value={staff.name} />
          <InfoRow label="Giới tính" value={staff.gender} />
          <InfoRow label="Ngày sinh" value={staff.birthday} />
          <InfoRow label="Chức vụ" value={staff.position} />
          <InfoRow label="Thời gian vào làm" value={staff.createdAt} />
          <InfoRow label="Số điện thoại" value={staff.phone} />
          <InfoRow label="Gmail" value={staff.email} />
          <InfoRow
            label="Mật khẩu"
            value={showPassword ? staff.password || "" : "********"}
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
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
          >
            Chỉnh sửa
          </button>
        </div>

        {isEditing && editData && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative">
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
                  { name: "birthday", label: "Ngày sinh", type: "date" },
                  { name: "position", label: "Chức vụ", type: "select", options: positions },
                  { name: "createdAt", label: "Thời gian vào làm", type: "date" },
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
  value: string | undefined;
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
