import { useEffect, useState } from 'react';
import { Navigate, Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth';

const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const tokenParam = searchParams.get('token');

            // 1. Check for Auto-Login token parameter
            if (tokenParam) {
                try {
                    console.log("Auto-login attempt with token");
                    
                    // Set token to localStorage so verifyToken interceptor can use it
                    localStorage.setItem('token', tokenParam);

                    const data = await verifyToken();
                    console.log("Token verification success:", data);

                    // If your verifyToken returns user data, you might want to store it
                    if (data?.data?.user?.id) {
                        localStorage.setItem('user_id', data.data.user.id);
                    }

                    setIsAuthenticated(true);
                    setIsLoading(false);
                    // Clear parameters from URL
                    navigate('/dashboard', { replace: true });
                    return;
                } catch (error) {
                    console.error("Token auto-login failed:", error);
                    localStorage.removeItem('token');
                    // Fallback to normal check
                }
            }

            // 2. Standard Token Check
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Verify token with backend
                await verifyToken();
                // If API call succeeds (200 OK), token is valid
                setIsAuthenticated(true);
            } catch (error) {
                // If API call fails (401/403), token is invalid
                console.error("Token verification failed:", error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, [searchParams, navigate]);

    if (isLoading) {
        // You can return a loading spinner here
        return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
