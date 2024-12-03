"use client";

import { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      text: 'Nouveau message de contact',
      time: '5 min',
      read: false
    },
    {
      id: 2,
      type: 'alert',
      text: 'Mise à jour de sécurité disponible',
      time: '1 heure',
      read: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <FaEnvelope className="text-blue-500" />;
      case 'alert':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  return (
    <div className="bg-[#1a1443] p-6 rounded-xl mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Centre de Notifications</h3>
        <span className="bg-pink-500 text-xs px-2 py-1 rounded-full">
          {notifications.filter(n => !n.read).length} nouvelles
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
              notif.read ? 'bg-[#0d1224]/50' : 'bg-[#0d1224]'
            }`}
            onClick={() => markAsRead(notif.id)}
          >
            {getIcon(notif.type)}
            <div className="flex-1">
              <p className={notif.read ? 'text-gray-400' : 'text-white'}>
                {notif.text}
              </p>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 