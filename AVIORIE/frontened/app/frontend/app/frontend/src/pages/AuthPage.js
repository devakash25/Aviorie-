import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package } from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    full_name: '',
    role: 'customer',
    address: '',
    area_id: '',
    login: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        address: formData.address,
        area_id: formData.area_id || undefined
      });
      
      if (response.data.requires_otp) {
        setUserId(response.data.user_id);
        setShowOtp(true);
        toast.success('OTP sent to your email and phone!');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post(`/auth/verify-otp?user_id=${userId}&otp=${formData.otp}`);
      toast.success('Account created successfully! Please login.');
      setMode('login');
      setShowOtp(false);
      setFormData({ ...formData, otp: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        login: formData.login,
        password: formData.password
      });
      
      if (response.data.requires_approval) {
        toast.info('Your account is pending approval');
        navigate('/waiting-approval');
        return;
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Login successful!');
      
      const roleRoutes = {
        customer: '/customer',
        delivery_partner: '/delivery-partner',
        manager: '/manager',
        admin: '/admin'
      };
      
      navigate(roleRoutes[response.data.user.role] || '/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-sky-100">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Aviorie</h1>
          </div>

          {!showOtp ? (
            <>
              {/* Mode Toggle */}
              <div className="flex space-x-2 mb-6 bg-sky-50 p-1 rounded-full">
                <button
                  data-testid="login-tab"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  data-testid="signup-tab"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login">Email or Phone</Label>
                    <Input
                      data-testid="login-email-input"
                      id="login"
                      name="login"
                      type="text"
                      placeholder="Enter email or phone"
                      value={formData.login}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      data-testid="login-password-input"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    data-testid="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full py-6 font-semibold"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      data-testid="signup-name-input"
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      data-testid="signup-email-input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      data-testid="signup-phone-input"
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">I want to register as</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger data-testid="signup-role-select" className="mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="delivery_partner">Delivery Partner</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      data-testid="signup-address-input"
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  {formData.role === 'manager' && (
                    <div>
                      <Label htmlFor="area_id">Area ID</Label>
                      <Input
                        data-testid="signup-area-input"
                        id="area_id"
                        name="area_id"
                        type="text"
                        placeholder="Enter area ID"
                        value={formData.area_id}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      data-testid="signup-password-input"
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    data-testid="signup-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full py-6 font-semibold"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              )}
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verify OTP</h3>
                <p className="text-sm text-gray-600">Enter the OTP sent to your email and phone</p>
              </div>
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input
                  data-testid="otp-input"
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  className="mt-1 text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                data-testid="verify-otp-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full py-6 font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
