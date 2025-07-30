"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, X } from "lucide-react";
import Link from "next/link";

const rankBySpending = (amount: number) => {
  if (amount >= 10000000) return "Vàng";
  if (amount >= 5000000) return "Bạc";
  return "Đồng";
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // yyyy-mm-dd
};

export default function MemberPage() {
  const [members, setMembers] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Nam",
    birthdate: "",
    phone: "",
    email: "",
    total_spent: 0,
  });

  const [unsaved, setUnsaved] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAddMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        member_id: Date.now(),
        ...formData,
        join_date: getToday(), // Gán ngày hiện tại
      },
    ]);
    setShowModal(false);
    setFormData({
      full_name: "",
      gender: "Nam",
      birthdate: "",
      phone: "",
      email: "",
      total_spent: 0,
    });
    setUnsaved(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (unsaved) {
          const confirmClose = confirm("Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ mất.");
          if (!confirmClose) return;
        }
        setShowModal(false);
        setUnsaved(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, unsaved]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto text-blue-900">
        <h1 className="text-3xl font-bold">Quản lý hội viên</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => setShowModal(true)}
        >
          + Thêm hội viên
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-auto max-w-6xl mx-auto">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm">
            <tr>
              <th className="p-4">Tên</th>
              <th className="p-4">SĐT</th>
              <th className="p-4">Hạng</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.member_id} className="border-t hover:bg-gray-50 text-base">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    {member.full_name}
                  </div>
                </td>
                <td className="p-4">{member.phone}</td>
                <td className="p-4 font-bold text-yellow-700">
                  {rankBySpending(member.total_spent)}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/members/${member.member_id}`}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>
          <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => {
                  if (unsaved) {
                    const confirmClose = confirm("Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ mất.");
                    if (!confirmClose) return;
                  }
                  setShowModal(false);
                  setUnsaved(false);
                }}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-800">Thêm hội viên</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    value={formData.full_name}
                    onChange={(e) => {
                      setFormData({ ...formData, full_name: e.target.value });
                      setUnsaved(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                      setUnsaved(true);
                    }}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    value={formData.birthdate}
                    onChange={(e) => {
                      setFormData({ ...formData, birthdate: e.target.value });
                      setUnsaved(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SĐT</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setUnsaved(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setUnsaved(true);
                    }}
                  />
                </div>
              </div>
              <button
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
                onClick={handleAddMember}
              >
                Lưu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
