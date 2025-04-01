import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaSignInAlt, FaUserPlus, FaSearch, FaPhone, FaMapMarkerAlt, FaUser, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import axiosInstance from '../utils/axiosConfig';

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchOrderCount = async () => {
        try {
          const response = await axiosInstance.get('/order/all-orders');
          setOrderCount(response.data.data.length);
        } catch (error) {
          console.error('Failed to fetch order count:', error);
        }
      };
      fetchOrderCount();
    }
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Add admin header render function
  const renderAdminHeader = () => {
    return (
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <NavLink to="/admin" className="flex items-center space-x-3">
              <FaRegCalendarAlt className="text-yellow-400 text-2xl" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </NavLink>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1">
            <div className="space-y-2">
              {/* Dashboard Overview */}
              <NavLink 
                to="/admin" 
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <FaRegCalendarAlt className="text-xl" />
                <span>Tours Overview</span>
              </NavLink>

              {/* Create Tour */}
              <NavLink 
                to="/admin/create-tour" 
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <FaPlus className="text-xl" />
                <span>Create Detail Tour</span>
              </NavLink>
            </div>
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <FaUser className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{user?.username}</div>
                <div className="text-sm text-gray-400">Administrator</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 w-full">
          {/* Top Bar */}
          <div className="fixed top-0 right-0 left-64 bg-white shadow-md z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  {window.location.pathname === '/admin' ? 'Tours Overview' : 'Create New Tour'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modify the return statement to conditionally render admin or regular header
  return (
    <>
      {isLoggedIn && user?.userType === 'admin' ? (
        renderAdminHeader()
      ) : (
        <div className="fixed w-full z-50">
          {/* Top Bar */}
          <div className="bg-gray-900 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <a href="tel:+1234567890" className="flex items-center hover:text-yellow-300 transition-colors">
                  <FaPhone className="mr-2" />
                  <span>+1 234 567 890</span>
                </a>
                <a href="#" className="flex items-center hover:text-yellow-300 transition-colors">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Địa Điểm</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-yellow-300 transition-colors">Hỗ Trợ</a>
                <a href="#" className="hover:text-yellow-300 transition-colors">Liên Hệ</a>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <motion.nav 
            className="bg-white text-gray-800 py-4 px-6 shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <NavLink to="/" className="flex items-center space-x-2">
                  <FaRegCalendarAlt className="text-blue-600 text-3xl" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    TourBooking
                  </span>
                </NavLink>
              </motion.div>

              {/* Main Menu */}
              <div className="flex items-center space-x-8">
                {[
                  { path: "/", label: "Trang Chủ", icon: null },
                  { path: "/visit", label: "Tours", icon: <FaRegCalendarAlt /> },
                  { path: "/order", label: "Orders", icon: <FaSearch />, badge: isLoggedIn ? orderCount : null },
                  { path: "/about", label: "Giới Thiệu", icon: <IoMdHelpCircleOutline /> }
                ].map((link, index) => (
                  <motion.div
                    key={`menu-${link.path}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink 
                      to={link.path} 
                      className={({ isActive }) => 
                        `flex items-center space-x-1 text-base font-medium transition duration-300 relative
                        ${isActive 
                          ? "text-blue-600 border-b-2 border-blue-600" 
                          : "hover:text-blue-600"}`
                      }
                    >
                      {link.icon && <span className="text-lg">{link.icon}</span>}
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="flex items-center bg-blue-50 rounded-full px-4 py-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaUser className="text-blue-600 mr-2" />
                      <span className="text-gray-800 font-medium">{user?.username}</span>
                    </motion.div>
                    
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignOutAlt className="mr-1" />
                      <span>Đăng xuất</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link 
                      to="/login" 
                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </>
  );
}