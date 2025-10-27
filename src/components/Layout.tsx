import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, BarChart3, Send, LogOut, User, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex-row flex-col flex justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  MyDowntown Dubai
                </h1>
                <p className="text-xs text-zinc-400">Email Marketing System</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <nav className="py-2 flex space-x-8">
                <Link
                  to="/create-campaign"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-yellow-400 text-black"
                      : "border border-gray-50 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  <span>Create Campaign</span>
                </Link>
                <Link
                  to="/campaigns"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/campaigns")
                      ? "bg-yellow-400 text-black"
                      : "border border-gray-50  text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Track Campaigns</span>
                </Link>
                <Link
                  to="/advanced-analytics"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/advanced-analytics")
                      ? "bg-yellow-400 text-black"
                      : "border border-gray-50 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Advanced Analytics</span>
                </Link>
              </nav>

              {/* User info and logout */}
              <div className="flex items-center space-x-4 border-l border-zinc-700 pl-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-300">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
