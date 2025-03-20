import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaSignInAlt, FaUserPlus, FaSearch, FaPhone, FaMapMarkerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
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
              { path: "/tours", label: "Tours", icon: <FaRegCalendarAlt /> },
              { path: "/search", label: "Tìm Kiếm", icon: <FaSearch /> },
              { path: "/about", label: "Giới Thiệu", icon: <IoMdHelpCircleOutline /> }
            ].map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => 
                    `flex items-center space-x-1 text-base font-medium transition duration-300 
                    ${isActive 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "hover:text-blue-600"}`
                  }
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  <span>{link.label}</span>
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
  );
}