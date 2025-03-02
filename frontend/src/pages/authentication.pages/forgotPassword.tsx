import { message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';


const SuccessMessage = ({ message }: { message: string }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
    {message}
  </div>
);

export const ForgotPassword = ({ role }: { role: string }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();



  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSuccess('');

    if (!validateEmail(email)) {
      message.error('Please enter a valid email address');
      emailRef.current?.focus();
      return;
    }

    try {
      setIsLoading(true)
      await axios.post('/api/auth/forgot-password', { email, role });
      setIsLoading(false)
      setSuccess('Password reset link has been sent to your email');
      setTimeout(() => {
        navigate(`/${role.toLowerCase()}/login`)
      }, 5000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message || "An unexpected error occurred");
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { error: string } } };
        message.error(err.response.data.error || "An unexpected error occurred");
      } else {
        message.error("An unexpected error occurred");
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h2>

        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className={`w-full h-11 flex items-center justify-center rounded font-medium text-white transition-colors 
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none`}>
            {isLoading ? 'Sending...' : `Send Reset Link`}
          </button>
        </form>
      </div>
    </div>
  );
};




export const ResetPassword = ({ role }: { role: string }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSuccess('');

    if (!validatePassword(newPassword)) {
      message.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
      message.success('Password reseted successfuly')
      setTimeout(() => {
        message.success('Login to continue')
        navigate(`/${role.toLowerCase()}/login`)
      }, 200)
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response: { data: { error: string } } };
        message.error(err.response.data.error || "An unexpected error occurred");

        if (err.response.data.error === "Token expired Please Try Again") {
          setTimeout(() => {
            navigate(`/${role.toLowerCase()}/forgot-password`);
          }, 2000);
        }
      } else {
        message.error("An unexpected error occurred");
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>

        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter new password"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm new password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-11 flex items-center justify-center rounded font-medium text-white transition-colors
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

