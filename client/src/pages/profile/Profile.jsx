import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle, Mail, Lock, Shield, User as UserIcon, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('Image size must be less than 2MB');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
      toast.success('Image selected. Click Save Changes to apply.');
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      if (data.success) {
        setUser(data.user); // Update context
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoadingPassword(true);
    try {
      const { data } = await api.put('/auth/password', { password: passwordData.password });
      if (data.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ password: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h2>
        <p className="text-gray-500 mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Profile Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-gray-100 shadow-sm text-center pt-6">
            <CardContent className="flex flex-col items-center gap-4">
              <label className="relative group cursor-pointer block">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="h-32 w-32 rounded-full object-cover shadow-md" />
                ) : (
                  <UserCircle className="h-32 w-32 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-8 w-8" />
                </div>
              </label>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2">
                {user?.role}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-500" /> Personal Information
              </CardTitle>
              <CardDescription>Update your name and contact email.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleProfileChange}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleProfileChange}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      required
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={loadingProfile} className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Save size={16} /> {loadingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm border-t-4 border-t-red-400">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" /> Security Settings
              </CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updatePassword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="password" 
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-50"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="password" 
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-50"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="destructive" disabled={loadingPassword} className="gap-2">
                    <Shield size={16} /> {loadingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Profile;
