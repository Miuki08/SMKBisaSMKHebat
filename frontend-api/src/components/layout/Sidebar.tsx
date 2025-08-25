"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  LogOut,
  User,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
    },
    {
      title: 'Tampil Data',
      icon: BookOpen,
      path: '/lessons',
    },
    {
      title: 'Tambah Data',
      icon: PlusCircle,
      path: '/lessons/create',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center">
            <span className="ml-2 text-xl font-bold text-blue-600 dark:text-white">Sistem Pembelajaran</span>
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="h-full overflow-y-auto pb-16">
          <nav className="px-4 py-6">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={index}
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors mb-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User section and logout */}
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                <User className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}