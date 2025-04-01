import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSpinner, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from 'axios';

// Thêm các animation variants cho Framer Motion
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const tableRowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const toursPerPage = 4;
  
  // Form state for creating/editing tour
  const [formData, setFormData] = useState({
    name: '',
    typeoftours_id: '',
    startplace: '',
    endplace: '',
    title: '',
    day_number: '',
    night_number: '',
    image: '',
    status: 'active'
  });

  // Fetch tours and tour types on component mount
  useEffect(() => {
    fetchTours();
    fetchTourTypes();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(' http://localhost:3000/api/tour/get-all-tour');
      if (response.data.state) {
        setTours(response.data.data);
      } else {
        console.error('Error fetching tours:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTourTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/typetour/getall_type');
      if (response.data.state) {
        setTourTypes(response.data.data);
      } else {
        console.error('Error fetching tour types:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tour types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      typeoftours_id: '',
      startplace: '',
      endplace: '',
      title: '',
      day_number: '',
      night_number: '',
      image: '',
      status: 'active'
    });
    setShowCreateModal(true);
  };

  const openEditModal = (tour) => {
    setCurrentTour(tour);
    setFormData({
      name: tour.name,
      typeoftours_id: tour.typeoftours_id,
      startplace: tour.startplace,
      endplace: tour.endplace,
      title: tour.title,
      day_number: tour.day_number,
      night_number: tour.night_number,
      image: tour.image,
      status: tour.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a tour');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/tour/create-tour', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.state) {
        setShowCreateModal(false);
        fetchTours();
        setShowSuccessModal(true); // Show success modal
        setTimeout(() => setShowSuccessModal(false), 2000); // Hide after 2 seconds
      } else {
        alert(response.data.message || 'Failed to create tour');
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      if (error.response?.status === 401) {
        alert('Please login to create a tour');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to create tours');
      } else {
        alert(error.response?.data?.message || 'Failed to create tour. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to update a tour');
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/tour/update-tour/${currentTour.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.state) {
        setShowEditModal(false);
        fetchTours(); // Refresh the tours list
        alert('Tour updated successfully!');
      } else {
        alert(response.data.message || 'Failed to update tour');
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      if (error.response?.status === 401) {
        alert('Please login to update a tour');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to update tours');
      } else {
        alert(error.response?.data?.message || 'Failed to update tour. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to delete a tour');
          return;
        }

        const response = await axios.delete(`http://localhost:3000/api/tour/delete-tour/${tourId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.state) {
          fetchTours();
          setSelectedTour(null);
          alert('Tour deleted successfully!');
        } else {
          alert(response.data.message || 'Failed to delete tour');
        }
      } catch (error) {
        console.error('Error deleting tour:', error);
        if (error.response?.status === 401) {
          alert('Please login to delete a tour');
        } else if (error.response?.status === 403) {
          alert('You do not have permission to delete tours');
        } else {
          alert(error.response?.data?.message || 'Failed to delete tour. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleTourStatus = async (tour) => {
    try {
      await axios.patch(`http://localhost:3000/api/tours/${tour.id}/status`, {
        status: tour.status === 'active' ? 'inactive' : 'active'
      });
      fetchTours();
    } catch (error) {
      console.error('Error toggling tour status:', error);
    }
  };

  // Calculate pagination
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / toursPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pl-64 pt-20">
      <div className="container mx-auto p-6">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Tour Management System
              </motion.h1>
              <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === 'tours' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('tours')}
              >
                Tours Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === 'users' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Users Dashboard
              </motion.button>
            </div>
          </div>

          {/* Tours Management */}
          {activeTab === 'tours' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Tour Collection
                </h2>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
                  onClick={openCreateModal}
                >
                  <FaPlus className="mr-2" /> New Tour
                </motion.button>
              </div>

              {loading && !tours.length ? (
                <motion.div 
                  className="flex justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTours.map((tour) => (
                        <motion.tr 
                          key={tour.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <img 
                              src={tour.image} 
                              alt={tour.title}
                              className="h-20 w-32 object-cover rounded-lg"
                              onClick={() => setSelectedTour(tour)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                            <div className="text-sm text-gray-500">{tour.name}</div>
                            <div className="text-sm text-gray-500">From: {tour.startplace} To: {tour.endplace}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{tour.day_number} days, {tour.night_number} nights</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tour.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tour.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleTourStatus(tour)}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                tour.status === 'active'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {tour.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour.id)}
                              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
                    >
                      <FaChevronLeft />
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Users Management - placeholder for future implementation */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quản lý Users</h2>
              <p className="text-gray-600">Tính năng đang được phát triển...</p>
            </motion.div>
          )}

          {/* Tour Detail Modal */}
          {selectedTour && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div 
                className="bg-white rounded-xl p-8 max-w-2xl w-full m-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-2xl font-bold mb-4">{selectedTour.title}</h2>
                <img 
                  src={selectedTour.image} 
                  alt={selectedTour.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <p><strong>Location:</strong> {selectedTour.location}</p>
                  <p><strong>Price:</strong> ${selectedTour.price}</p>
                  <p><strong>Duration:</strong> {selectedTour.duration} days</p>
                  <p><strong>Max Group Size:</strong> {selectedTour.maxGroupSize} people</p>
                  <p><strong>Difficulty:</strong> {selectedTour.difficulty}</p>
                  <p><strong>Description:</strong> {selectedTour.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedTour(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl m-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Tour</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter tour name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
                    <select
                      name="typeoftours_id"
                      value={formData.typeoftours_id}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select tour type</option>
                      {tourTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter tour title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Place</label>
                    <input
                      type="text"
                      name="startplace"
                      value={formData.startplace}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter start place"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Place</label>
                    <input
                      type="text"
                      name="endplace"
                      value={formData.endplace}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter end place"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                      <input
                        type="number"
                        name="day_number"
                        value={formData.day_number}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="1"
                        placeholder="Days"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                      <input
                        type="number"
                        name="night_number"
                        value={formData.night_number}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        placeholder="Nights"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Create Tour</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chỉnh sửa Tour</h2>
        <form onSubmit={handleUpdateTour}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tên Tour</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Địa điểm</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Giá</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">URL Hình ảnh</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="active">Hiển thị</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setShowEditModal(false)}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaEdit className="mr-2" />}
              Cập nhật
            </button>
          </div>
        </form>
      </motion.div>
    </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-4 flex items-center space-x-3 z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
          >
            <FaCheck className="text-white" />
          </motion.div>
          <p className="text-gray-800 font-medium">Tour created successfully!</p>
        </motion.div>
      )}
    </div>
  );
}
