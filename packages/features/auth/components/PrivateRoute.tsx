import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return <>{children}</>;
};
export default PrivateRoute;
//# sourceMappingURL=PrivateRoute.js.map