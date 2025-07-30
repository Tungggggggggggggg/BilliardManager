"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, User, X } from "lucide-react";

type UserCog = {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  createdAt: string;
};

const initialUserCog: UserCog[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Quản lý",
    phone: "0123456789",
    email: "a@example.com",
    birthday: "1990-01-01",
    gender: "Nam",
    createdAt: "2025-07-30 12:00:00",
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Nhân viên",
    phone: "0987654321",
    email: "b@example.com",
    birthday: "1995-05-15",
    gender: "Nữ",
    createdAt: "2025-07-30 12:30:00",
  },
];

export default function StaffPage() {
  const [userCogs, setUserCogs] = useState<UserCog[]>(initialUserCog);
  const [showModal, setShowModal] = useState(false);
  const [autoPassword, setAutoPassword] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [newUser, setNewUser] = useState<Omit<UserCog, "id" | "createdAt"> & { password: string }>({
    name: "",
    position: "Nhân viên",
    phone: "",
    email: "",
    birthday: "",
    gender: "Nam",
    password: "",
  });
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAddUser = () => {
    const { name, phone, email, position, password, birthday, gender } = newUser;
    if (!name || !phone || !email || !position || !password || !birthday || !gender) {
      setError("Vui lòng nhập đầy đủ thông tin, bao gồm mật khẩu.");
      return;
    }

    const createdAt = new Date().toLocaleString("sv-SE", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });

    setUserCogs([
      ...userCogs,
      { id: Date.now(), name, phone, email, position, birthday, gender, createdAt },
    ]);
    setShowModal(false);
    setNewUser({
      name: "",
      phone: "",
      email: "",
      position: "Nhân viên",
      password: "",
      birthday: "",
      gender: "Nam",
    });
    setAutoPassword(false);
    setError("");
    setUnsaved(false);
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (unsaved) {
          const confirmClose = confirm("Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ mất.");
          if (!confirmClose) return;
        }
        setShowModal(false);
        setError("");
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
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto text-blue-900">
        <h1 className="text-4xl font-bold">Quản lý nhân viên</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow text-base cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden max-w-5xl mx-auto">
        <table className="min-w-full table-auto text-base">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm">
            <tr>
              <th className="p-3">Tên</th>
              <th className="p-3">Chức vụ</th>
              <th className="p-3">Ngày sinh</th>
              <th className="p-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {userCogs.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    {user.name}
                  </div>
                </td>
                <td className="p-3">{user.position}</td>
                <td className="p-3">{user.birthday}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/staff/${user.id}`}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4 shadow-lg relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => {
                if (unsaved) {
                  const confirmClose = confirm("Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ mất.");
                  if (!confirmClose) return;
                }
                setShowModal(false);
                setError("");
                setUnsaved(false);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-blue-800">Thêm nhân viên</h2>

            <div className="grid grid-cols-2 gap-4 text-base">
              <input
                type="text"
                placeholder="Họ và tên"
                value={newUser.name}
                onChange={(e) => {
                  setNewUser({ ...newUser, name: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newUser.phone}
                onChange={(e) => {
                  setNewUser({ ...newUser, phone: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => {
                  setNewUser({ ...newUser, email: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              />
              <select
                value={newUser.position}
                onChange={(e) => {
                  setNewUser({ ...newUser, position: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              >
                <option value="Nhân viên">Nhân viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
              <input
                type="date"
                value={newUser.birthday}
                onChange={(e) => {
                  setNewUser({ ...newUser, birthday: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              />
              <select
                value={newUser.gender}
                onChange={(e) => {
                  setNewUser({ ...newUser, gender: e.target.value });
                  setUnsaved(true);
                }}
                className="px-3 py-2 border rounded w-full"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>

              {!autoPassword && (
                <input
                  type="text"
                  placeholder="Mật khẩu"
                  value={newUser.password}
                  onChange={(e) => {
                    setNewUser({ ...newUser, password: e.target.value });
                    setUnsaved(true);
                  }}
                  className={`px-3 py-2 border rounded w-full ${error.includes("mật khẩu") ? "border-red-500" : ""}`}
                />
              )}

              <div className="col-span-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoPassword}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAutoPassword(checked);
                      setNewUser({
                        ...newUser,
                        password: checked ? generateRandomPassword() : "",
                      });
                      setUnsaved(true);
                    }}
                  />
                  Tạo mật khẩu ngẫu nhiên
                </label>
                {autoPassword && <span className="text-sm text-gray-500">🔒 {newUser.password}</span>}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  if (unsaved) {
                    const confirmClose = confirm("Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ mất.");
                    if (!confirmClose) return;
                  }
                  setShowModal(false);
                  setError("");
                  setUnsaved(false);
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
