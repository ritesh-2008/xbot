import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Twitter, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Twitter className="w-12 h-12 text-x-blue" />
          </div>
          <h1 className="text-3xl font-bold">Join XBot</h1>
          <p className="text-gray-400 mt-2">
            Create an account to start leveraging your tweets with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder=""
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder=""
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder=""
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder=""
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-x-blue hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
