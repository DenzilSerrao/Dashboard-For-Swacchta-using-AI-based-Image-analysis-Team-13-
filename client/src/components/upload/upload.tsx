import { useState } from "react";

function Upload() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(`Upload successful! Result: ${result.message}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col space-y-6 p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>User Profile</li>
          <li>Alerts</li>
          <li>User Diagnostic</li>
          <li>Contribution</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, John Doe!</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Upload Image
          </button>
        </header>

        {/* Recent Uploads Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Placeholder for uploads */}
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Upload Image</h2>
              <button
                className="block w-full bg-green-600 text-white py-2 mb-4 rounded"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Upload from System
              </button>
              <button
                className="block w-full bg-blue-600 text-white py-2 mb-4 rounded"
                onClick={() => alert("Google Drive integration not implemented yet.")}
              >
                Upload from Drive
              </button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <button
                className="block w-full bg-gray-300 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Upload;
