import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  console.log("Current user:", user);
  console.log("Required roles:", allowedRoles);

  if (!user) {
    return <Navigate to="/main" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role not allowed:", user.role);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 