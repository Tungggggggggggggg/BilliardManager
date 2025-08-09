"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { CheckCircle2 } from "lucide-react";

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const notificationRef = useRef(null);

  const bgColor = {
    'success': 'bg-green-500',
    'error': 'bg-red-500',
    'info': 'bg-blue-500',
  }[type] || 'bg-gray-500';

  useEffect(() => {
    gsap.fromTo(notificationRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    const timer = setTimeout(() => {
      gsap.to(notificationRef.current, { 
        y: -100, 
        opacity: 0, 
        duration: 0.5, 
        onComplete: onClose 
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={notificationRef}
      className={`fixed top-4 right-4 z-[999] text-white p-4 rounded-lg shadow-lg flex items-center gap-3 ${bgColor}`}
    >
      <CheckCircle2 className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default Notification;