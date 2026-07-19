import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    role: 'Fan'
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(formData);
      toast.success('Registration successful!');
      
      // Role-based redirect
      if (res.user.role === 'Admin') navigate('/admin');
      else if (res.user.role === 'Organizer') navigate('/organizer');
      else if (res.user.role === 'Volunteer') navigate('/volunteer');
      else navigate('/fan');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">StadiumOS AI</h1>
          <p className="text-gray-500 mt-2">Create a new account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role (MVP Demo Only)</Label>
            <select 
              id="role" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Fan">Fan</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Organizer">Organizer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
