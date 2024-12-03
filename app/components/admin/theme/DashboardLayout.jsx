"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHome, FaCog, FaBell, FaUser, FaProjectDiagram, 
  FaBlog, FaEnvelope, FaPalette, FaBars, FaTimes 
} from 'react-icons/fa';
import GlobalSearch from '../search/GlobalSearch';
import UserMenu from '../user/UserMenu';

const menuItems = [
  { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
  { path: '/admin/projects', icon: FaProjectDiagram, label: 'Projets' },
  { path: '/admin/blogs', icon: FaBlog, label: 'Articles' },
  { path: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
  { path: '/admin/portfolio', icon: FaPalette, label: 'Portfolio' },
  { path: '/admin/settings', icon: FaCog, label: 'Paramètres' },
];

export default function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const pathname = usePathname();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar transform transition-transform duration-300 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } z-50`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h2>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-link ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">
                <item.icon className={pathname === item.path ? 'text-pink-500' : 'text-gray-400'} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {showSidebar ? <FaTimes /> : <FaBars />}
                </button>
                <GlobalSearch />
              </div>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
                  <FaBell />
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-violet-500 rounded-full">
                    3
                  </span>
                </button>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 