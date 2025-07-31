"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const rankBySpending = (point: number) => {
  if (point >= 10000000) return "Vàng";
  if (point >= 5000000) return "Bạc";
  return "Đồng";
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

  const member = members.find((m) => m.member_id === parseInt(id as string)) || members[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...member });

  const genders = ["Nam", "Nữ", "Khác"];

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xoá hội viên này?")) {
      alert("Đã xoá hội viên");
      router.push("/members");
    }
  };

  const handleOpenEdit = () => {
    setEditData({ ...member });
    setIsEditing(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    const isChanged = JSON.stringify(editData) !== JSON.stringify(member);
    if (isChanged) {
      const confirmCancel = window.confirm(
        "Bạn có chắc muốn huỷ chỉnh sửa? Mọi thay đổi sẽ không được lưu."
      );
      if (!confirmCancel) return;
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    alert("Đã cập nhật thông tin hội viên!");
  };

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết hội viên #{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          <InfoRow label="Họ tên" value={member.full_name} />
          <InfoRow label="Giới tính" value={member.gender} />
          <InfoRow label="Ngày sinh" value={member.birthdate} />
          <InfoRow label="Số điện thoại" value={member.phone} />
          <InfoRow label="Email" value={member.email} />
          <InfoRow label="Ngày tham gia" value={member.join_date} />
          <InfoRow label="Hạng hội viên" value={rankBySpending(member.total_spent)} />
          <InfoRow label="Điểm tích luỹ" value={member.total_spent.toLocaleString()} />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
          >
            Xoá hội viên
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
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Chỉnh sửa thông tin hội viên
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["fullName", "gender", "birthdate", "phone", "email", "joinDate", "point"].map((key) => {
                  const labelMap: Record<string, string> = {
                    fullName: "Họ tên",
                    gender: "Giới tính",
                    birthdate: "Ngày sinh",
                    phone: "Số điện thoại",
                    email: "Email",
                    joinDate: "Ngày tham gia",
                    point: "Điểm tích luỹ",
                  };
                  const type = key === "birthdate" || key === "joinDate" ? "date" : key === "point" ? "number" : "text";

                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {labelMap[key]}
                      </label>
                      {key === "gender" ? (
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {genders.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          name={key}
                          value={(editData as any)[key]}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  );
                })}
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
