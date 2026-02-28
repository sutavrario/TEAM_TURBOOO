import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'motion/react';
import { Mail, Lock, Chrome, Apple } from 'lucide-react';
import { WaveformEKG } from '../components/WaveformEKG';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const { loginWithRedirect } = useAuth0();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use Auth0's loginWithRedirect for proper authentication
        loginWithRedirect({
            appState: { returnTo: '/dashboard' },
            authorizationParams: {
                screen_hint: 'login',
            }
        });
    };

    const handleSSOLogin = (provider: string) => {
        console.log(`Logging in with ${provider}`);
        loginWithRedirect({
            appState: { returnTo: '/dashboard' },
            authorizationParams: {
                connection: provider === 'Google' ? 'google-oauth2' : 'apple',
                screen_hint: 'login',
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Left Side - Brand/Visual */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Radial glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
                    {/* Waveform/EKG Animation */}
                    <div className="w-full h-64 mb-12">
                        <WaveformEKG />
                    </div>

                    {/* Brand Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-white to-pink-400 bg-clip-text text-transparent">
                            VocalGuard
                        </h1>
                        <p className="text-xl text-slate-300">
                            Clinical-grade vocal health tracking.
                            <br />
                            <span className="text-cyan-400">Powered by AI.</span>
                        </p>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/20 rounded-full"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.08, 1],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.5
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-pink-500/20 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    {/* Glassmorphism Card */}
                    <div className="relative">
                        {/* Glow effect behind card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl blur-xl" />

                        {/* Main card */}
                        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-slate-400">
                                    Log in securely to access your vocal health data.
                                </p>
                            </div>

                            {/* SSO Buttons */}
                            <div className="space-y-3 mb-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSSOLogin('Google')}
                                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                                >
                                    <Chrome className="w-5 h-5" />
                                    Continue with Google
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSSOLogin('Apple')}
                                    className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 border border-slate-700"
                                >
                                    <Apple className="w-5 h-5" />
                                    Continue with Apple
                                </motion.button>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900 text-slate-500">or</span>
                                </div>
                            </div>

                            {/* Email/Password Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedInput('email')}
                                            onBlur={() => setFocusedInput(null)}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 outline-none transition-all duration-200 ${focusedInput === 'email'
                                                    ? 'border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.1)]'
                                                    : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedInput('password')}
                                            onBlur={() => setFocusedInput(null)}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 outline-none transition-all duration-200 ${focusedInput === 'password'
                                                    ? 'border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.1)]'
                                                    : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="flex justify-end">
                                    <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Sign In Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/25"
                                >
                                    Sign In
                                </motion.button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <Lock className="w-3 h-3" />
                                    <p>Your biometric data is encrypted and strictly confidential.</p>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-400">
                                    Don't have an account?{' '}
                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Logo */}
                    <div className="lg:hidden mt-8 text-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                            VocalGuard
                        </h1>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
