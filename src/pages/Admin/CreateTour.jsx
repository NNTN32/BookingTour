import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCalendarAlt, FaUsers, FaBus, FaDollarSign, FaClipboardList, FaCheck, FaUserFriends, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';

export default function CreateTour() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tours, setTours] = useState([]);
  const [transporters, setTransporters] = useState([]);

  const [formData, setFormData] = useState({
    tour_id: '',
    startday: '',
    endday: '',
    description: '',
    numerseatunoccupied: '',
    numberpeoplebooked: '0',
    transportertourid: '',
    price: '',
  });

  // Check user authentication on mount
  useEffect(() => {
    if (!isLoggedIn) {
      setErrorMessage('Please login to create a detail tour');
      setShowErrorModal(true);
      setTimeout(() => {
        navigate('/login', { state: { from: '/admin/create-detail-tour' } });
      }, 2000);
      return;
    }

    if (user && user.userType !== 'admin') {
      setErrorMessage('Only admin users can create detail tours');
      setShowErrorModal(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    // Fetch tours and transporters when component mounts
    const fetchData = async () => {
      try {
        // Fetch tours
        const toursResponse = await axiosInstance.get('/tour/getall_tours');
        if (toursResponse.data.state) {
          setTours(toursResponse.data.data);
        }

        // Fetch transporters
        const transportersResponse = await axiosInstance.get('/trans/getall_trans');
        if (transportersResponse.data.state) {
          setTransporters(transportersResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setErrorMessage('Authentication error. Please login again.');
          setShowErrorModal(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    };

    fetchData();
  }, [isLoggedIn, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = () => {
    const startDate = new Date(formData.startday);
    const endDate = new Date(formData.endday);
    
    if (startDate >= endDate) {
      setErrorMessage('Start date must be before end date');
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication again before submission
    if (!isLoggedIn) {
      setErrorMessage('Please login to create a detail tour');
      setShowErrorModal(true);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (user && user.userType !== 'admin') {
      setErrorMessage('Only admin users can create detail tours');
      setShowErrorModal(true);
      return;
    }

    // Validate dates
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/tour/create-detailTour', formData);
      
      if (response.data.state) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/admin');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Failed to create detail tour');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error creating detail tour:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create detail tour');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pl-64 pt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8"
        >
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Create Detail Tour</h1>
            <div className="h-1 w-24 bg-blue-600 ml-4 rounded-full" />
          </div>

          {/* Admin Authentication Badge */}
          {user && user.userType === 'admin' && (
            <div className="mb-6 flex items-center space-x-2 bg-green-50 text-green-800 py-2 px-4 rounded-lg">
              <FaLock className="text-green-600" />
              <span>Authenticated as Admin: {user.username}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tour Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaClipboardList className="mr-2 text-blue-500" />
                Select Tour
              </label>
              <select
                name="tour_id"
                value={formData.tour_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Select a tour</option>
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Date Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startday"
                  value={formData.startday}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endday"
                  value={formData.endday}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaUsers className="mr-2 text-blue-500" />
                  Number of Seats
                </label>
                <input
                  type="number"
                  name="numerseatunoccupied"
                  value={formData.numerseatunoccupied}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaUserFriends className="mr-2 text-blue-500" />
                  Number of People Booked
                </label>
                <input
                  type="number"
                  name="numberpeoplebooked"
                  value={formData.numberpeoplebooked}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBus className="mr-2 text-blue-500" />
                  Transporter
                </label>
                <select
                  name="transportertourid"
                  value={formData.transportertourid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select a transporter</option>
                  {transporters.map(transporter => (
                    <option key={transporter.id} value={transporter.id}>
                      {transporter.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaDollarSign className="mr-2 text-blue-500" />
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isLoggedIn || (user && user.userType !== 'admin')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Detail Tour</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4 z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
            >
              <FaCheck className="text-green-500 text-xl" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900">Success!</h3>
              <p className="text-gray-600">Detail tour created successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4 z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ repeat: 2, duration: 0.5 }}
              >
                <FaLock className="text-red-500 text-xl" />
              </motion.div>
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900">Authentication Error</h3>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
