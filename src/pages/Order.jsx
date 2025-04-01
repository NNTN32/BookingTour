import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaPlane, FaClock, FaMapMarkerAlt, FaTimes, FaInfoCircle, FaChevronRight } from 'react-icons/fa';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [relatedTours, setRelatedTours] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/order/all-orders');
        setOrders(response.data.data);
        const total = response.data.data.reduce((sum, order) => sum + order.totalprice, 0);
        setTotalAmount(total);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = async (order) => {
    try {
      setSelectedOrder(order);
      setLoadingDetails(true);
      const response = await axiosInstance.get(`/order/order-detail/${order.detailtour_id}`);
      if (response.data.state) {
        setOrderDetails(response.data.data);
        // After getting order details, fetch related tours
        fetchRelatedTours(response.data.data.detailtours.tour_id);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchRelatedTours = async (tourId) => {
    try {
      setLoadingRelated(true);
      const response = await axiosInstance.get(`/tour/get-All-DetailTour-By-TourId/${tourId}`);
      if (response.data.state) {
        setRelatedTours(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching related tours:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
    setRelatedTours(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 bg-red-50 p-4 rounded-lg shadow"
      >
        {error}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Travel Journey</h1>
          <p className="text-gray-600">Track your adventures and bookings</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold">{orders.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold">${totalAmount.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Travelers</p>
                <h3 className="text-2xl font-bold">
                  {orders.reduce((sum, order) => sum + order.numberpeople, 0)}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaPlane className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Latest Order</p>
                <h3 className="text-2xl font-bold">
                  {orders.length > 0 ? new Date(orders[0].date).toLocaleDateString() : 'N/A'}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">People</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {order.typeoforder_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-gray-400" />
                        {order.numberpeople}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${order.totalprice.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
            >
              {/* Modal Header */}
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes className="text-white text-xl" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-white/80">
                    Booked on {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                    />
                    <p className="mt-4 text-gray-500">Loading tour details...</p>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-8">
                    {/* Tour Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <FaUsers className="text-white text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total Travelers</p>
                            <p className="text-2xl font-bold text-blue-900">{selectedOrder.numberpeople}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <FaMoneyBillWave className="text-white text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Total Price</p>
                            <p className="text-2xl font-bold text-purple-900">
                              ${selectedOrder.totalprice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <FaCalendarAlt className="text-white text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-green-600 font-medium">Duration</p>
                            <p className="text-2xl font-bold text-green-900">
                              {Math.ceil((new Date(orderDetails.detailtours.endday) - new Date(orderDetails.detailtours.startday)) / (1000 * 60 * 60 * 24))} Days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tour Schedule */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FaClock className="text-blue-500 mr-2" />
                        Tour Schedule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="text-lg font-medium text-gray-900 flex items-center">
                            {new Date(orderDetails.detailtours.startday).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(orderDetails.detailtours.endday).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tour Description */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        Tour Description
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {orderDetails.detailtours.description}
                        </p>
                      </div>
                    </div>

                    {/* Booking Status */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                        <FaUsers className="text-blue-500 mr-2" />
                        Booking Status
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 mb-1">Total Booked</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {orderDetails.detailtours.numberpeoplebooked} People
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 mb-1">Seats Available</p>
                          <p className="text-2xl font-bold text-green-900">
                            {orderDetails.detailtours.numerseatunoccupied} Seats
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tour Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-8">
                      <div className="relative h-64">
                        <img 
                          src={relatedTours?.tour.image} 
                          alt={relatedTours?.tour.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="absolute bottom-0 p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">{relatedTours?.tour.name}</h3>
                            <p className="text-white/90 text-lg">{relatedTours?.tour.title}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Location Info */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-500 rounded-lg">
                                <FaMapMarkerAlt className="text-white text-xl" />
                              </div>
                              <div>
                                <p className="text-sm text-blue-600 font-medium">Location</p>
                                <p className="text-base font-semibold text-blue-900">
                                  {relatedTours?.tour.startplace} → {relatedTours?.tour.endplace}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Duration Info */}
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-500 rounded-lg">
                                <FaClock className="text-white text-xl" />
                              </div>
                              <div>
                                <p className="text-sm text-purple-600 font-medium">Duration</p>
                                <p className="text-base font-semibold text-purple-900">
                                  {relatedTours?.tour.day_number} Days {relatedTours?.tour.night_number} Nights
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Tour Type */}
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-500 rounded-lg">
                                <FaPlane className="text-white text-xl" />
                              </div>
                              <div>
                                <p className="text-sm text-green-600 font-medium">Tour Type</p>
                                <p className="text-base font-semibold text-green-900">
                                  Type {relatedTours?.tour.typeoftours_id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                          onClick={() => window.location.href = `/tour/${relatedTours?.tour.id}`}
                        >
                          <span>View Full Tour Details</span>
                          <FaChevronRight />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500">No details available for this order</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {orderDetails && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <button
                    onClick={closeModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                  >
                    <FaTimes className="text-lg" />
                    <span>Close Details</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
