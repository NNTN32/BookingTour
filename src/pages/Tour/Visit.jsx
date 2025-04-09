import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaSearch, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosConfig';

const Visit = () => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/tour/get-all-tour");
        console.log("Tours data:", response.data.data);
        setTours(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const heroSlides = [
    {
      title: "Khám Phá Việt Nam",
      subtitle: "Những địa điểm tuyệt đẹp đang chờ đón bạn",
      image: "https://d3lc2v4pocabbd.cloudfront.net/wp-content/uploads/2021/07/travel-2081174_1280.jpg",
      cta: "Khám Phá Ngay"
    },
    {
      title: "Du Lịch Nghỉ Dưỡng",
      subtitle: "Tận hưởng kỳ nghỉ tuyệt vời cùng gia đình",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdE5jC4TrsxtwSEEsv-JFjlnrrNUcVfSe8PFaBUuwWEqOCpwcHIS1dh_oZtsBgA7P00z8&usqp=CAU",
      cta: "Đặt Tour"
    },
    {
      title: "Trải Nghiệm Văn Hóa",
      subtitle: "Khám phá văn hóa độc đáo các vùng miền",
      image: "https://www.technoheaven.net/Theme/img/Tour-Booking-Software.jpg",
      cta: "Tìm Hiểu Thêm"
    }
  ];

  const handleViewDetail = (tourId) => {
    console.log("Clicked tour ID:", tourId);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { 
        state: { from: `/tour/${tourId}` } 
      });
      return;
    }
    navigate(`/tour/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Dynamic Sliding Background */}
      <div className="relative h-[80vh] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
                filter: 'brightness(0.7)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            
            <div className="relative h-full flex items-center px-4">
              <div className="container mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-xl md:text-2xl text-white mb-12"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105"
                      onClick={() => {
                        const targetSection = document.querySelector('.tour-list');
                        if (targetSection) {
                          targetSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {heroSlides[currentSlide].cta}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-300"
                      onClick={() => navigate('/about')}
                    >
                      Tìm hiểu thêm
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white py-8 shadow-lg relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 -mt-24 relative z-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tìm kiếm tour du lịch</h2>
            
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên tour, địa điểm..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-4 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 text-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 tour-list">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
            <p>Có lỗi xảy ra: {error}</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Danh Sách Tour</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá và lựa chọn những hành trình tuyệt vời cho chuyến đi tiếp theo của bạn
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={`tour-${tour.id || tour._id || index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative">
                    <img 
                      src={tour.image} 
                      alt={tour.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Hot Deal
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">{tour.name}</h3>
                      <div className="flex items-center text-white/90">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{tour.startplace}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{tour.title}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-500">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        <span>{tour.startplace} → {tour.endplace}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaClock className="mr-2 text-orange-500" />
                        <span>{tour.day_number} ngày {tour.night_number} đêm</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        console.log("Tour data:", tour);
                        console.log("Tour ID being used:", tour.id || tour._id);
                        handleViewDetail(tour.id || tour._id);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      Xem Chi Tiết
                      <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Visit;