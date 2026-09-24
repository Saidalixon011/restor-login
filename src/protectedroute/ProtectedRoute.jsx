import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(userRole)
    : allowedRole === userRole;

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;