import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/user/UserProfile';
import Alerts from './components/dashboard/Alerts';
import UserDiagnostic from './components/user/UserDiagnostic';
import Contribution from './components//dashboard/Contribution';
import Settings from './components/settings/Settings';
import Marquee from './components/common/Marquee';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

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
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;