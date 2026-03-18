import { useEffect, useState } from 'react';
import { Navigate, Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyToken, login } from '../api/auth';
import { DecryptData } from '../hooks/crypto';

const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const emailParam = searchParams.get('email');
            const passParam = searchParams.get('pass');

            // 1. Check for Auto-Login parameters
            if (emailParam && passParam) {
                try {
                    // Fix '+' characters being interpreted as spaces in URL
                    const sanitizedEmail = emailParam.replace(/ /g, '+');
                    const sanitizedPass = passParam.replace(/ /g, '+');

                    const decryptedEmail = DecryptData(sanitizedEmail);
                    const decryptedPass = DecryptData(sanitizedPass);

                    console.log("Auto-login attempt:", {
                        email: decryptedEmail,
                        passProvided: !!decryptedPass
                    });

                    if (decryptedEmail && decryptedPass) {
                        const data = await login({ email: decryptedEmail, password: decryptedPass });
                        console.log("Auto-login API success:", data);

                        const token = data.data.access_token;
                        const userId = data.data.user?.id;

                        if (token) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user_id', userId);
                            setIsAuthenticated(true);
                            setIsLoading(false);
                            // Clear parameters from URL
                            navigate('/dashboard', { replace: true });
                            return;
                        }
                    } else {
                        console.warn("Decryption failed to produce email or password");
                    }
                } catch (error) {
                    console.error("Auto-login process error:", error);
                    // Fallback to token check
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
