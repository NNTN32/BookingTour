import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown, FaSearch, FaArrowRight } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';

export default function Main() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Đổi slide tự động
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch tours từ API khi component mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/tour/get-all-tour');
        
        if (response.data.state) {
          // Lấy 6 tour mới nhất và mapping dữ liệu
          const latestTours = response.data.data.slice(0, 6).map((tour, index) => ({
            id: tour.id || tour._id,
            title: tour.name,
            location: `${tour.startplace} - ${tour.endplace}`,
            duration: `${tour.day_number} ngày ${tour.night_number} đêm`,
            people: `2-${Math.floor(Math.random() * 15 + 5)} người`, // Số người demo
            category: getCategoryFromTourType(tour.tyoftour_name || tour.typeoftours_id),
            featured: index < 3, // 3 tour đầu sẽ được đánh dấu là featured
            image: tour.image || "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
          }));
          
          setFeaturedTours(latestTours);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Hàm helper để map loại tour sang category
  const getCategoryFromTourType = (tourType) => {
    // Map tour type từ API sang category hiển thị
    const typeMap = {
      'Beach': 'beach',
      'Mountain': 'mountain',
      'Cultural': 'cultural',
      'Adventure': 'adventure',
      1: 'beach',
      2: 'mountain',
      3: 'cultural',
      4: 'adventure'
    };
    
    return typeMap[tourType] || 'all';
  };

  // Danh sách slides cho hero section
  const heroSlides = [
    {
      title: "Khám Phá Vẻ Đẹp Việt Nam",
      subtitle: "Hành trình đến với những địa danh nổi tiếng và bí ẩn của đất nước hình chữ S",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
      cta: "Khám phá ngay"
    },
    {
      title: "Trải Nghiệm Văn Hóa",
      subtitle: "Đắm chìm trong nét đẹp văn hóa truyền thống các dân tộc Việt Nam",
      image: "https://images.unsplash.com/photo-1540329957110-b87b06f5eaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
      cta: "Xem tours"
    },
    {
      title: "Thiên Nhiên Hùng Vĩ",
      subtitle: "Chinh phục những đỉnh núi cao, thác nước và hang động kỳ vĩ",
      image: "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
      cta: "Bắt đầu hành trình"
    }
  ];

  // Danh mục tour
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'beach', name: 'Biển đảo' },
    { id: 'mountain', name: 'Núi rừng' },
    { id: 'cultural', name: 'Văn hóa' },
    { id: 'adventure', name: 'Mạo hiểm' }
  ];

  // Lọc tours theo danh mục
  const filteredTours = activeCategory === 'all' 
    ? featuredTours 
    : featuredTours.filter(tour => tour.category === activeCategory);

  // Danh sách testimonials
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Du khách thường xuyên",
      content: "Tôi đã đi nhiều tour nhưng tour Hạ Long của công ty là tuyệt vời nhất. Dịch vụ chu đáo, hướng dẫn viên nhiệt tình và thân thiện.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Blogger du lịch",
      content: "Đây là lần thứ ba tôi sử dụng dịch vụ và vẫn hài lòng như lần đầu tiên. Đặc biệt là quy trình đặt tour online rất dễ dàng và tiện lợi.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Nhiếp ảnh gia",
      content: "Tour Sapa mang đến cho tôi nhiều góc chụp tuyệt đẹp. Lịch trình được sắp xếp hợp lý, không quá gấp gáp nhưng vẫn đầy đủ trải nghiệm.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section with Dynamic Sliding Background */}
      <div className="relative h-screen overflow-hidden">
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
            
            <div className="relative h-full flex items-center justify-center px-4">
              <div className="max-w-6xl mx-auto text-center">
                <motion.h1 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row justify-center gap-4"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate('/visit')}
                  >
                    {heroSlides[currentSlide].cta}
                  </button>
                  
                  <button 
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-300"
                    onClick={() => navigate('/about')}
                  >
                    Tìm hiểu thêm
                  </button>
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
      {/* <div className="bg-white py-8 shadow-lg relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 -mt-24 relative z-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tìm kiếm tour du lịch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
                  <FaMapMarkerAlt className="text-orange-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Bạn muốn đi đâu?"
                    className="w-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                  />
                </div>
                
                {showSearchDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="p-2">
                      <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Hạ Long</div>
                      <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Sapa</div>
                      <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Đà Nẵng</div>
                      <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Phú Quốc</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
                <FaCalendarAlt className="text-orange-500 mr-2" />
                <select className="w-full bg-transparent focus:outline-none">
                  <option>Thời gian đi</option>
                  <option>Tháng 5/2023</option>
                  <option>Tháng 6/2023</option>
                  <option>Tháng 7/2023</option>
                </select>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
                <FaUserFriends className="text-orange-500 mr-2" />
                <select className="w-full bg-transparent focus:outline-none">
                  <option>Số người</option>
                  <option>1-2 người</option>
                  <option>3-5 người</option>
                  <option>6-10 người</option>
                  <option>Trên 10 người</option>
                </select>
              </div>
              
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-3 font-semibold flex items-center justify-center gap-2 transition-colors duration-300">
                <FaSearch />
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>
      </div> */}
      
      {/* Featured Tours Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tour Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá những tour du lịch được yêu thích nhất của chúng tôi, mang đến những trải nghiệm khó quên
            </p>
          </motion.div>
          
          {/* Tour Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
          
          {/* Tours Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>Có lỗi xảy ra: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"; // Fallback image
                      }}
                    />
                    
                    {tour.featured && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Hot
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">{tour.title}</h3>
                      <div className="flex items-center text-white/90">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{tour.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2 text-orange-500" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUserFriends className="mr-2 text-orange-500" />
                        <span>{tour.people}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {tour.price}
                      </div>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        Chi Tiết
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition-all duration-300"
              onClick={() => navigate('/visit')}
            >
              Xem tất cả tours
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Khách Hàng Nói Gì?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Những trải nghiệm thực tế từ khách hàng đã sử dụng dịch vụ của chúng tôi
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={`testimonial-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4 gap-4">
                  <img 
                    src={item.avatar} 
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-200"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{item.content}"</p>
                
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Sẵn sàng cho chuyến đi tiếp theo?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            Đặt tour ngay hôm nay và nhận ưu đãi đặc biệt!
            Giảm ngay 10% cho đơn hàng đầu tiên khi đăng ký thành viên.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
              onClick={() => navigate('/visit')}
            >
              Khám phá tours
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              Đăng ký thành viên
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
