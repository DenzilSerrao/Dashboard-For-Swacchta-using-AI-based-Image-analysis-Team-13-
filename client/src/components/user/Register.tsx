import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from '../dashboard/Dashboard';
import Sidebar from '../common/Sidebar';

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Set to `true` to display the modal by default
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        username,
        password,
        email,
      });
      console.log('Registration successful:', response.data);
      setIsModalOpen(false); // Close modal on successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="relative">
      {/* Dashboard and Sidebar */}
      <div
        className={`h-screen w-screen bg-gray-100 ${
          isModalOpen ? 'blur-sm' : '' // Apply blur only when modal is open
        }`}
      >
        <Sidebar activeTab={''} setActiveTab={function (tab: string): void {
          throw new Error('Function not implemented.');
        } } />
        <Dashboard />
      </div>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <p className="text-center text-2xl font-bold mb-6">Register Your Account</p>
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-teal-500 text-white font-bold py-2 rounded-lg hover:bg-teal-600 transition duration-200"
              >
                Register
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <span className="text-teal-500 font-bold cursor-pointer">
                Log in
              </span>
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-500 rounded-lg text-sm hover:bg-gray-200 transition duration-200">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
                    C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
                    l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24
                    C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Register with Google
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-black rounded-lg text-sm bg-black text-white hover:bg-gray-800 transition duration-200">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
                </svg>
                Register with Apple
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
