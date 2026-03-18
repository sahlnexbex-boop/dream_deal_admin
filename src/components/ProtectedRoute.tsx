import { useEffect, useState } from 'react';
import { Navigate, Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth';

const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Skip check if already authenticated (prevents double call after redirect)
        if (isAuthenticated && !searchParams.get('token')) {
            setIsLoading(false);
            return;
        }

        const checkToken = async () => {
            const tokenParam = searchParams.get('token');

            // 1. Handle Token from URL (Auto-Login)
            if (tokenParam) {
                try {
                    console.log("Token verification attempt from URL...");
                    
                    // Set token to localStorage so axios can use it in headers
                    localStorage.setItem('token', tokenParam);

                    const data = await verifyToken();
                    console.log("Verify token success:", data);

                    // Store user ID if present in response
                    if (data?.data?.user?.id) {
                        localStorage.setItem('user_id', data.data.user.id);
                    }

                    setIsAuthenticated(true);
                    setIsLoading(false);

                    // Redirect to dashboard without the token in the URL
                    navigate('/dashboard', { replace: true });
                    return;
                } catch (error) {
                    console.error("Verify token error:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
            }

            // 2. Standard Token Check (from localStorage)
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Verify existing token with backend
                await verifyToken();
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Stored token verification failed:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, [searchParams, navigate, isAuthenticated]);

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
