import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('token');

    if (isAuthenticated) {
      return <Outlet />;; // Render the protected content
    } else {
      return <Navigate to="/authorize" />; // Redirect to the login page
    }
  }

  export default ProtectedRoute;