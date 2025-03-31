import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Main from './pages/Main';
import About from './pages/About';
import Header from "./components/Header";
import Footer from "./components/footer";
import Login from './pages/Login';
import Register from "./pages/Register";
import Admin from "./pages/Admin/Admin";
import Visit from "./pages/Tour/Visit";
import ProtectedRoute from "./components/ProtectedRoute";
import TourDetail from "./pages/Tour/TourDetail";
import CreateTour from './pages/Admin/CreateTour';
import Order from './pages/Order';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/admin/create-tour" element={<CreateTour />} />
          <Route 
            path="/order" 
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
