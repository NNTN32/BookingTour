import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUsers, FaDollarSign, FaInfoCircle, FaCheck } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';


const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetailTour, setSelectedDetailTour] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    numberpeople: 1,
    totalprice: 0
  });
  const [orderError, setOrderError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log("Tour ID from URL params:", id);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching details for tour ID:", id);
        const response = await axiosInstance.get(`/tour/get-All-DetailTour-By-TourId/${id}`);
        console.log("Tour detail response:", response.data);
        
        if (response.data.state) {
          setTourDetails(response.data.data);
          // Mặc định chọn tour đầu tiên
          if (response.data.data.detailTours.length > 0) {
            setSelectedDetailTour(response.data.data.detailTours[0]);
          }
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching tour details:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetails();
    }
  }, [id]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { from: `/tour/${id}` } 
      });
      return;
    }

    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.id) {
        throw new Error('Invalid token or user information not found');
      }

      const orderData = {
        typeoforderid: 1,
        user_id: decodedToken.id,
        numberpeople: orderForm.numberpeople,
        totalprice: orderForm.totalprice,
        detailtour_id: selectedDetailTour.id
      };

      const response = await axiosInstance.post('/order/create-order', orderData);
      
      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/my-orders');
        }, 5000);
      } else {
        setOrderError(response.data.message || 'Có lỗi xảy ra khi đặt tour');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setOrderError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update total price when number of people changes
  useEffect(() => {
    if (selectedDetailTour) {
      setOrderForm(prev => ({
        ...prev,
        totalprice: selectedDetailTour.price * prev.numberpeople
      }));
    }
  }, [selectedDetailTour, orderForm.numberpeople]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCheck className="text-green-500 text-4xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt Tour Thành Công!</h2>
              <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt tour. Chúng tôi sẽ liên hệ với bạn sớm.</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-2 bg-green-500 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {tourDetails && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          {/* Tour Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-96">
              <img 
                src={tourDetails.tour.image} 
                alt={tourDetails.tour.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-8 text-white">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-4"
                  >
                    {tourDetails.tour.name}
                  </motion.h1>
                  <p className="text-xl opacity-90">{tourDetails.tour.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Thông Tin Tour</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm font-medium">Điểm Khởi Hành</p>
                      <p className="text-lg">{tourDetails.tour.startplace}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaMapMarkerAlt className="text-red-500 text-xl" />
                    <div>
                      <p className="text-sm font-medium">Điểm Đến</p>
                      <p className="text-lg">{tourDetails.tour.endplace}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaClock className="text-green-500 text-xl" />
                    <div>
                      <p className="text-sm font-medium">Thời Gian</p>
                      <p className="text-lg">{tourDetails.tour.day_number} ngày {tourDetails.tour.night_number} đêm</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Available Tours Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Lịch Khởi Hành</h2>
                <div className="space-y-4">
                  {tourDetails.detailTours.map((detail) => (
                    <motion.div
                      key={detail.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedDetailTour?.id === detail.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'border border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedDetailTour(detail)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-blue-500" />
                          <span className="font-medium">
                            {new Date(detail.startday).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-green-600 font-bold">
                          ${detail.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaUsers className="text-gray-400" />
                        <span>Còn {detail.numerseatunoccupied} chỗ trống</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Selected Tour Details */}
          {selectedDetailTour && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Chi Tiết Lịch Trình</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">
                  {selectedDetailTour.description}
                </p>
              </div>
              
              {!showOrderForm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300"
                  onClick={() => setShowOrderForm(true)}
                >
                  Đặt Tour Này
                </motion.button>
              ) : (
                <form onSubmit={handleOrderSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số người
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedDetailTour.numerseatunoccupied}
                      value={orderForm.numberpeople}
                      onChange={(e) => setOrderForm(prev => ({
                        ...prev,
                        numberpeople: parseInt(e.target.value)
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá vé người lớn:</span>
                      <span className="font-semibold">${selectedDetailTour.price}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${orderForm.totalprice}
                      </span>
                    </div>
                  </div>

                  {orderError && (
                    <div className="text-red-500 text-sm">
                      {orderError}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300"
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </div>
                      ) : (
                        'Xác nhận đặt tour'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TourDetail; 