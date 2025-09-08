import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../components/ui/RoleBasedRouter';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useRole();

  // Mock credentials for demonstration
  const mockCredentials = {
    email: 'teacher@quizmaster.com',
    password: 'teacher123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      if (formData?.email === mockCredentials?.email && formData?.password === mockCredentials?.password) {
        const userData = {
          name: 'Teacher',
          email: formData?.email,
          id: 'teacher_001',
          institution: 'QuizMaster Academy'
        };
        
        login('teacher', userData);
      } else {
        setErrors({
          general: `Invalid credentials. Use: ${mockCredentials?.email} / ${mockCredentials?.password}`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here. For demo, use: teacher@quizmaster.com / teacher123');
  };

  const handleCreateAccount = () => {
    alert('Account creation would redirect to registration page. For demo, use existing credentials.');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full mx-auto mb-4 shadow-lg">
            <Icon name="GraduationCap" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">Welcome Back</h1>
          <p className="text-lg text-gray-600 font-medium">Sign in to your teacher account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-2 shadow">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName="LogIn"
            iconPosition="left"
            className="mt-6 bg-gradient-to-tr from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-600"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Button
              variant="link"
              onClick={handleForgotPassword}
              className="text-sm text-blue-700 hover:text-purple-600"
            >
              Forgot your password?
            </Button>
          </div>
          <div className="text-center pt-4 border-t border-blue-100">
            <p className="text-sm text-gray-500 mb-2">
              Don't have an account?
            </p>
            <Button
              variant="outline"
              onClick={handleCreateAccount}
              iconName="UserPlus"
              iconPosition="left"
              className="w-full border-blue-300 text-blue-700 font-semibold hover:bg-blue-50"
            >
              Create Teacher Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;