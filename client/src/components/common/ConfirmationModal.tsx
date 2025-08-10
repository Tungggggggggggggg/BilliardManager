import React from "react";

export interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  color?: "red" | "yellow" | "blue" | "green";
  icon?: React.ReactNode;
  loading?: boolean;
}

const ConfirmationModal = React.forwardRef<HTMLDivElement, ConfirmationModalProps>(
  (
    {
      onConfirm,
      onCancel,
      title,
      message,
      confirmText,
      cancelText,
      color = "blue",
      icon,
      loading = false,
    },
    ref
  ) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-100 text-red-600",
      yellow: "bg-amber-100 text-amber-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
    };
    const colorClass = colorMap[color] || colorMap.blue;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
        <div
          ref={ref}
          className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-md mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-full ${colorClass.split(" ")[0]}`}>
              {icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-7 h-7 ${colorClass.split(" ")[1]}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">{title}</h3>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                color === "red"
                  ? "bg-red-600 hover:bg-red-700"
                  : color === "yellow"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : color === "green"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
