import React, { useState, useEffect } from 'react';
import {
  Upload,
  BarChart2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line
} from 'recharts';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [weeklyScore, setWeeklyScore] = useState<{ score: number; message: string; trendData: { month: string; score: number }[] }>({
    score: 0,
    message: '',
    trendData: [],
  });
  const [alerts, setAlerts] = useState(0);
  const [uploads, setUploads] = useState<{ id: string; name: string; thumbnailUrl: string; uploadedAt: string }[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'Success' | 'Failed' | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data fetching functions
        const welcome = { name: 'John Doe', alerts: 3 }; // Replace with API call
        setUserName(welcome.name);
        setAlerts(welcome.alerts);

        const score = {
          score: 85,
          message: 'Great job this week!',
          trendData: [
            { month: 'Jan', score: 75 },
            { month: 'Feb', score: 80 },
            { month: 'Mar', score: 85 },
          ],
        }; // Replace with API call
        setWeeklyScore(score);

        const uploads = [
           ]; // Replace with API call
        setUploads(uploads);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate file upload
      setUploadStatus('Success');
    } catch (error) {
      setUploadStatus('Failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Welcome Card */}
      <div className="md:col-span-2 space-y-6">
        <div className="p-4 border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Welcome, {userName}!</h2>
          <div className="flex items-center justify-between mt-4">
                  {/* File Upload */}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-green-600 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            // Simulate file upload dialog
          }}
        >
          <Upload className="mr-2" size={20} />
          Upload File
        </button>
        {uploadStatus === 'Success' && (
          <div className="mt-2 bg-green-100 border border-green-500 text-green-700 p-2 rounded-lg">
            <h3 className="font-bold">Upload Successful</h3>
            <p>Your file has been uploaded.</p>
          </div>
        )}
        {uploadStatus === 'Failed' && (
          <div className="mt-2 bg-red-100 border border-red-500 text-red-700 p-2 rounded-lg">
            <h3 className="font-bold">Upload Failed</h3>
            <p>There was an error uploading your file.</p>
          </div>
        )}
            {alerts > 0 && (
              <div className="text-red-500 flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                {alerts} New Alerts
              </div>
            )}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="p-4 border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Recent Uploads</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {uploads.length > 0 ? (
              uploads.map((upload) => (
                <div key={upload.id} className="aspect-square bg-gray-200 rounded-lg">
                  <img src={upload.thumbnailUrl} alt={upload.name} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No uploads yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Side Panels */}
      <div className="space-y-6">
        {/* Weekly Score */}
        <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold">Weekly Score</h2>
          <div className="text-4xl font-bold text-green-600">{weeklyScore.score}</div>
          <p className="text-gray-600">{weeklyScore.message}</p>
          <div className="mt-4">
            <LineChart width={300} height={200} data={weeklyScore.trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>

        {/* Analysis */}
        <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold">Analysis</h2>
          <BarChart2
            size={48}
            className="text-green-500 mb-2 transition-transform duration-300 hover:text-green-700 hover:scale-110"
            aria-label="Bar Chart Icon"
          />
          <p className="text-gray-600">Your cleanliness efforts are improving!</p>
        </div>

        {/* Reports & Guidelines */}
        <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold">Reports & Guidelines</h2>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center">
              <FileText
                size={20}
                className="mr-2 text-green-500 transition-transform duration-300 hover:scale-110 hover:text-green-700"
                aria-label="Report Icon"
              />
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 hover:underline hover:border-b-2 hover:border-green-500 transition-all duration-300"
              >
                Monthly Report
              </a>
            </li>
            <li className="flex items-center">
              <FileText
                size={20}
                className="mr-2 text-green-500 transition-transform duration-300 hover:scale-110 hover:text-green-700"
                aria-label="Guidelines Icon"
              />
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 hover:underline hover:border-b-2 hover:border-green-500 transition-all duration-300"
              >
                Cleanliness Guidelines
              </a>
            </li>
          </ul>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
