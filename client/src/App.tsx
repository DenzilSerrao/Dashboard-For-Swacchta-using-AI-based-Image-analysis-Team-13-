import React, { useState } from 'react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './components/store/authStore';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/user/UserProfile';
import Alerts from './components/dashboard/Alerts';
import UserDiagnostic from './components/user/UserDiagnostic';
import Contribution from './components/dashboard/Contribution';
import Settings from './components/settings/Settings';
import Marquee from './components/common/Marquee';
import Upload from './components/upload/upload';
import { LoginForm } from './components/user/LoginForm';
import { RegisterForm } from './components/user/RegisterForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard'); // Active tab state
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true); // Set user as logged in when login is successful
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false); // Log the user out
  // };
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);
  
    if (isLoading) {
      return (
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      );
    }
  
    // Handle routing based on URL path
    const path = window.location.pathname;
    if (path === '/register' && !isAuthenticated) {
      return (
        <>
          <Toaster position="top-right" />
          <RegisterForm />
        </>
      );
    }
  
    if (!isAuthenticated) {
      return (
        <>
          <Toaster position="top-right" />
          <LoginForm />
        </>
      );
    }
    
  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'User Profile':
        return <UserProfile />;
      case 'Alerts':
        return <Alerts />;
      case 'User Diagnostic':
        return <UserDiagnostic />;
      case 'Contribution':
        return <Contribution />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <><div className="min-h-screen bg-gray-100 flex flex-col">
      <Marquee />
        <div className="flex flex-1">
          {/* Sidebar and main content */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
    </div><Routes>
        {/* Define your routes here */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/diagnostic" element={<UserDiagnostic />} />
        <Route path="/contribution" element={<Contribution />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="*" element={<NotFound />} /> Catch-all route for 404 */}
      </Routes></>
  );
}

export default App;
