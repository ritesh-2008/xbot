import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Twitter,
  LayoutDashboard,
  Sparkles,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analyzer', icon: Sparkles, label: 'Tweet Analyzer' },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile header */}
      <header className="w-full bg-x-darker border-b border-gray-800 p-3 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Twitter className="w-6 h-6 text-x-blue" />
            <span className="text-lg font-bold">XBot</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">{user?.username}</div>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 bg-x-darker border-r border-gray-800 p-4 flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Twitter className="w-8 h-8 text-x-blue" />
          <span className="text-xl font-bold">XBot</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-x-blue text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-10 h-10 bg-x-blue rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.username}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-x-darker p-4 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Twitter className="w-6 h-6 text-x-blue" />
                <span className="text-lg font-bold">XBot</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-x-blue text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-gray-800 pt-4 mt-4">
              <div className="flex items-center gap-3 px-4 py-2 mb-2">
                <div className="w-10 h-10 bg-x-blue rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.username}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
