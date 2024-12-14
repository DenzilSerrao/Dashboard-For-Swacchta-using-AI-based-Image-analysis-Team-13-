import React from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { authApi } from "../services/api";

const LiveMode: React.FC = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLiveMode = async () => {
    try {
        
      const response = await authApi.runLiveMode(); // Sending a GET request to the /live-mode endpoint
      if (response.status === 200 && response.data.success) {
        alert("Live mode started successfully!");
         // Navigate to /live-mode URL upon success
      } else {
        console.error("Error starting live mode:", response.data.error);
        alert("Failed to start live mode. Please try again.");
      }
    } catch (error) {
      console.error("Error starting live mode:", error);
      alert("An error occurred while starting live mode.");
    }
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
      onClick={handleLiveMode}
    >
      <Camera className="mr-2" size={20} />
      Live Mode
    </button>
  );
};

export default LiveMode;
