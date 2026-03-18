import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OLD_PORTAL_URL } from '../utils/oldPortal';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../api/auth';
import { useToast } from '../components/Toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login({ email, password });

            console.log('Login response:', data);

            const token = data.data.access_token;
            const userId = data.data.user?.id;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', userId);
                toast('Logged in successfully!', 'success');
                navigate('/dashboard');
            } else {
                toast('Login failed: No token received', 'error');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            toast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-20 relative z-10">
                <div className="w-full max-w-[440px] space-y-8">
                    {/* Logo */}
                    <div className="mb-10">
                        <img
                            src="/Images/logo_with_text.png"
                            alt="Dream Deal Group"
                            className="h-16 w-auto object-contain"
                        />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                            Welcome Back <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                        </h1>
                        <p className="text-gray-500 text-md">
                            Sign in to your Promoter Portal
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 mt-8">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border-gray-200 bg-lime-50/50 px-4 py-3 text-gray-900 focus:border-lime-500 focus:bg-lime-50/20 focus:ring-2 focus:ring-lime-200 outline-none transition-all duration-200 ease-in-out"
                                placeholder="Enter your Email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Password
                                </label>
                                <a href={`${OLD_PORTAL_URL}/forgot-password`} className="text-sm !bg-transparent font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-lime-50/50 px-4 py-3 text-gray-900 focus:border-lime-500 focus:bg-lime-50/20 focus:ring-2 focus:ring-lime-200 outline-none transition-all duration-200 ease-in-out pr-12"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none !bg-transparent"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-lime-200 text-base font-bold text-black bg-lime-400 hover:bg-lime-500 hover:shadow-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6">
                        <p className="text-xs text-gray-400">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="hidden lg:block lg:w-1/2 relative bg-lime-100/30">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-50/50 to-transparent z-10" />
                <img
                    src="/Images/login_image.png"
                    alt="Dashboard Preview"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Decorative elements if needed, sticking to clean image for now */}
            </div>
        </div>
    );
};

export default Login;
