import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Alerts from './components/Alerts';
import UserDiagnostic from './components/UserDiagnostic';
import Contribution from './components/Contribution';
import Settings from './components/Settings';
import Marquee from './components/Marquee';

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