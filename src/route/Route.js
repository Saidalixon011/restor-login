import Login from "../login/login";
import Admin from "../admin/Admin";
import User from "../user/User";
import ProtectedRoute from "../protectedroute/ProtectedRoute";

export const routes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRole="user">
        <User />
      </ProtectedRoute>
    ),
  },
];