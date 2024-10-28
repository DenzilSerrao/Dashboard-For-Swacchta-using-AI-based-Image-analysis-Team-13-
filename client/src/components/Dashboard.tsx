import React, { useState } from 'react';
import { Upload, BarChart2, FileText, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('John Doe');
  const [weeklyScore, setWeeklyScore] = useState(85);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userName}!</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
              <Upload className="mr-2" size={20} />
              Upload Image
            </button>
            <div className="text-red-500 flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              3 New Alerts
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Score</h3>
          <div className="text-4xl font-bold text-green-600">{weeklyScore}</div>
          <p className="text-gray-600">Great job! Keep it up!</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis</h3>
          <BarChart2 size={48} className="text-green-500 mb-2" />
          <p className="text-gray-600">Your cleanliness efforts are improving!</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Reports & Guidelines</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FileText size={20} className="mr-2 text-green-500" />
              <a href="#" className="text-blue-500 hover:underline">Monthly Report</a>
            </li>
            <li className="flex items-center">
              <FileText size={20} className="mr-2 text-green-500" />
              <a href="#" className="text-blue-500 hover:underline">Cleanliness Guidelines</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;