"use client";

import { useState } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center"
      >
        <span className="text-sm font-bold">SA</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1443] rounded-xl shadow-lg py-1 border border-gray-800">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm font-medium">Sami Abdulhalim</p>
            <p className="text-xs text-gray-400">admin@portfolio.com</p>
          </div>

          <div className="py-1">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#0d1224]">
              <FaUser className="text-violet-500" />
              Profil
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#0d1224]">
              <FaCog className="text-violet-500" />
              Paramètres
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#0d1224]"
            >
              {isDark ? (
                <>
                  <FaSun className="text-yellow-500" />
                  Mode clair
                </>
              ) : (
                <>
                  <FaMoon className="text-blue-500" />
                  Mode sombre
                </>
              )}
            </button>
          </div>

          <div className="border-t border-gray-800 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-[#0d1224]"
            >
              <FaSignOutAlt />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 