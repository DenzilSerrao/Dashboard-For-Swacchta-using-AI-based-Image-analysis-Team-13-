import React, { useState } from 'react';
import { LayoutDashboard, User, Bell, Activity, Heart, Settings, LogIn } from 'lucide-react';
import Login from './Login';
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal visibility

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'User Profile', icon: User },
    { name: 'Alerts', icon: Bell },
    { name: 'User Diagnostic', icon: Activity },
    { name: 'Contribution', icon: Heart },
    { name: 'Settings', icon: Settings },
    { name: 'Login', icon: LogIn },
  ];

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <aside className="bg-green-600 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center w-full p-2 rounded transition-colors ${
                  activeTab === item.name ? 'bg-green-700' : 'hover:bg-green-500'
                }`}
              >
                <item.icon className="mr-2" size={20} />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;