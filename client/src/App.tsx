import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/user/UserProfile';
import Alerts from './components/dashboard/Alerts';
import UserDiagnostic from './components/user/UserDiagnostic';
import Contribution from './components/dashboard/Contribution';
import Settings from './components/settings/Settings';
import Marquee from './components/common/Marquee';
import Login from './components/user/Login';
import Register from './components/user/Register';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard'); // Active tab state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set user as logged in when login is successful
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Log the user out
  };

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Marquee />
      {isLoggedIn ? (
        <div className="flex flex-1">
          {/* Sidebar and main content */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      ) : (
        // Center Login component when the user is not logged in
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          {/* <Login onLoginSuccess={handleLoginSuccess} /> */}
          <Register onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
}

export default App;
