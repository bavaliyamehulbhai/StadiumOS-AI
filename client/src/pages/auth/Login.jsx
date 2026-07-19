import React from 'react';
import { Trophy, User, Shield, Briefcase, Lock } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success('Logged in successfully!');
      
      // Role-based redirect
      if (res.user.role === 'Admin') navigate('/admin');
      else if (res.user.role === 'Organizer') navigate('/organizer');
      else if (res.user.role === 'Volunteer') navigate('/volunteer');
      else navigate('/fan');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">StadiumOS AI</h1>
          <p className="text-gray-500 mt-2">Explore the Interactive Demo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? 'Entering System...' : 'Explore Demo'}
          </Button>
        </form>

        {/* Top 400 Demo Credentials */}
        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-gray-500 font-semibold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> 
              For Hackathon Judges
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            onClick={() => { setEmail('fan@demo.com'); setPassword('password123'); }}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full group"
          >
            <div className="flex items-center gap-2 mb-1 w-full justify-center text-gray-700 group-hover:text-blue-700">
              <User className="w-4 h-4" /> <span className="font-semibold text-sm">Fan</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">fan@demo.com</span>
            <span className="text-[10px] text-gray-400 font-mono">password123</span>
          </button>

          <button 
            type="button" 
            onClick={() => { setEmail('volunteer@demo.com'); setPassword('password123'); }}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full group"
          >
            <div className="flex items-center gap-2 mb-1 w-full justify-center text-gray-700 group-hover:text-blue-700">
              <Briefcase className="w-4 h-4" /> <span className="font-semibold text-sm">Volunteer</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">volunteer@demo.com</span>
            <span className="text-[10px] text-gray-400 font-mono">password123</span>
          </button>

          <button 
            type="button" 
            onClick={() => { setEmail('organizer@demo.com'); setPassword('password123'); }}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full group"
          >
            <div className="flex items-center gap-2 mb-1 w-full justify-center text-gray-700 group-hover:text-blue-700">
              <Shield className="w-4 h-4" /> <span className="font-semibold text-sm">Organizer</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">organizer@demo.com</span>
            <span className="text-[10px] text-gray-400 font-mono">password123</span>
          </button>

          <button 
            type="button" 
            onClick={() => { setEmail('admin@demo.com'); setPassword('password123'); }}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full group"
          >
            <div className="flex items-center gap-2 mb-1 w-full justify-center text-gray-700 group-hover:text-blue-700">
              <Lock className="w-4 h-4" /> <span className="font-semibold text-sm">Admin</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">admin@demo.com</span>
            <span className="text-[10px] text-gray-400 font-mono">password123</span>
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
