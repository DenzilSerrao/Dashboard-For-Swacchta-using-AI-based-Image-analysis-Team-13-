import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LiveCameraOutput: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set the source of the video element to the live stream URL
    if (videoRef.current) {
      videoRef.current.src = "http://localhost:5000/live-mode"; // Replace with your actual stream URL
      videoRef.current.play().catch((err) => {
        console.error("Error starting video playback:", err);
        alert("Failed to load the live feed. Please try again later.");
      });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live Camera Feed</h1>
      <div className="bg-black p-4 rounded shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay
          controls={false}
          muted
        ></video>
      </div>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        onClick={() => navigate("/dashboard")}
      >
        Stop Live Feed
      </button>
    </div>
  );
};

export default LiveCameraOutput;
