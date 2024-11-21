import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
          alt="Profile"
          className="w-24 h-24 rounded-full mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-600">Eco Warrior</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <User className="mr-2 text-green-500" size={20} />
          <span>John Doe</span>
        </div>
        <div className="flex items-center">
          <Mail className="mr-2 text-green-500" size={20} />
          <span>johndoe@example.com</span>
        </div>
        <div className="flex items-center">
          <Phone className="mr-2 text-green-500" size={20} />
          <span>+1 234 567 8900</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 text-green-500" size={20} />
          <span>New Delhi, India</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;