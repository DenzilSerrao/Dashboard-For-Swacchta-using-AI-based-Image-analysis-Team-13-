import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import uploadFile from "../services/api";
import { useAuthStore } from "../store/authStore";

const MAX_COUNT = 5;

const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileLimit, setFileLimit] = useState(false);
  const { uploadStatus, setUploadStatus } = useAuthStore();

  const handleUploadFiles = (files: File[]) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;

    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);

        if (uploaded.length === MAX_COUNT) {
          setFileLimit(true);
        }

        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          limitExceeded = true;
          return true;
        }
      }
      return false;
    });

    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConfirmUpload = async () => {
    try {
      for (const file of uploadedFiles) {
        await uploadFile(file);
      }
      setUploadStatus("Success");
      alert("All files uploaded successfully!");
    } catch (error) {
      setUploadStatus("Failed");
      alert("File upload failed.");
    }
  };

  return (
    <div className="file-upload">
      {/* Upload button */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-green-600 transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick();
        }}
      >
        <Upload className="mr-2" size={20} />
        Upload Files
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        accept="application/pdf, image/png"
        onChange={handleFileChange}
        disabled={fileLimit}
      />

      {/* List of uploaded files */}
      <div className="uploaded-files-list mt-4">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-2">
            <p>{file.name}</p>
          </div>
        ))}
      </div>

      {/* Upload status feedback */}
      {uploadStatus && (
        <div
          className={`mt-2 p-2 rounded-lg ${
            uploadStatus === "Success"
              ? "bg-green-100 border-green-500 text-green-700"
              : "bg-red-100 border-red-500 text-red-700"
          }`}
        >
          <h3 className="font-bold">
            {uploadStatus === "Success"
              ? "Upload Successful"
              : "Upload Failed"}
          </h3>
          <p>
            {uploadStatus === "Success"
              ? "Your files have been uploaded."
              : "There was an error uploading your files."}
          </p>
        </div>
      )}

      {/* Finalize upload */}
      {uploadedFiles.length > 0 && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={handleConfirmUpload}
        >
          Confirm Upload
        </button>
      )}
    </div>
  );
};

export default FileUpload;
