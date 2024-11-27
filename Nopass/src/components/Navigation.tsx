import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BookOpen, MessageSquare, User } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleProfileClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = 'http://localhost:5174/';
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Exercise & Diet', icon: Activity },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/communication', label: 'Communication', icon: MessageSquare },
    {
      path: '/profile',
      label: 'Calendar',
      icon: User,
      onClick: handleProfileClick,
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16 space-x-8">
          {navItems.map((item) =>
            item.path === '/profile' ? (
              <a
                key={item.path}
                href="#"
                onClick={item.onClick}
                className={`flex flex-col items-center px-4 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-4 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                {item.label}
              </Link>
            )
          )}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
