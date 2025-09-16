// components/admin/AdminHeader.tsx
"use client";

import {
  Menu,
  Search,
  ChevronDown,
  Globe,
  LogOut,
  Home,
  Users,
  FileText,
  Settings,
  UserCircle,
  BadgeDollarSign,
  DollarSign,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import { toast } from "sonner";
interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { admin, logout, isLoading } = useAdminAuth();
  const router = useRouter();

  // Navigation items for search
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: Home,
      description: "Overview and analytics",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
      description: "Manage user accounts",
    },
    {
      name: "Humanize Jobs",
      path: "/admin/documents",
      icon: FileText,
      description: "AI text humanization jobs",
    },
    {
      name: "Plans",
      path: "/admin/plans/list",
      icon: BadgeDollarSign,
      description: "Manage subscription plans",
    },
    {
      name: "Subscriptions",
      path: "/admin/subscriptions",
      icon: DollarSign,
      description: "Billing and subscriptions",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  // Dropdown navigation items (subset for dropdown menu)
  const dropdownNavItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Humanize Jobs", path: "/admin/documents", icon: FileText },
    { name: "Plans", path: "/admin/plans/list", icon: BadgeDollarSign },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: DollarSign },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Filter navigation items based on search query
  const filteredNavItems = navigationItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setSearchQuery("");
    setShowSearchResults(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have successfully logged out.");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleGoToWebsite = () => {
    window.open("/", "_blank");
    setIsDropdownOpen(false);
  };

  // Show loading state or placeholder if admin data is not available
  if (isLoading) {
    return (
      <header className="flex items-center justify-between px-4 lg:px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return "Good Morning";
              if (hour < 17) return "Good Afternoon";
              return "Good Evening";
            })()}
            , {admin?.name?.split(" ")[0] || "Admin"}!
          </h1>
          <p className="text-xs lg:text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Search Bar */}
        <div className="relative hidden sm:block" ref={searchRef}>
          <div
            className={cn(
              "flex items-center transition-all duration-200",
              isSearchFocused ? "w-64" : "w-48",
            )}
          >
            <Search className="absolute left-3 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
              {filteredNavItems.length > 0 ? (
                filteredNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors group bg-white"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors mr-3">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No navigation items found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors  bg-amber-50 "
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 transition-colors bg-gradient-to-br from-blue-500 to-purple-600">
              <UserCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white  " />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-700">{admin?.name}</p>
              <p className="text-xs text-gray-400 mt-1">{admin?.email}</p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-500 transition-transform duration-200",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                <p className="text-sm font-medium text-gray-700">
                  {admin?.name}
                </p>

                {admin?.email && (
                  <p className="text-xs text-gray-400 mt-1">{admin.email}</p>
                )}
              </div>

              {/* Navigation Routes */}
              {dropdownNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                  >
                    <IconComponent className="w-4 h-4 mr-3 text-gray-500" />
                    {item.name}
                  </button>
                );
              })}

              <hr className="my-2 border-gray-100" />

              <button
                onClick={handleGoToWebsite}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-amber-50 "
              >
                <Globe className="w-4 h-4 mr-3 text-gray-500" />
                Go to Website
              </button>

              <hr className="my-2 border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-900 hover:bg-red-50 transition-colors bg-amber-200 font-bold "
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-800" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
