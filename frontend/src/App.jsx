import { useRef, useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null); // Holds the selected file
  const fileInputRef = useRef(); // Reference to the hidden file input
  const [url, setUrl] = useState(null); // URL for the uploaded file
  const [details, setDetails] = useState(null); // File details or error messages

  // Function to upload the file to the backend
  const uploadFile = async () => {
    if (!file) return;

    // Validate file size (example: max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxFileSize) {
      setDetails({ error: "File size exceeds 5MB limit. Please upload a smaller file." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload the file.");

      const data = await response.json();
      console.log('data',data);
      
      setUrl(data?.path); // Set the file path returned by the backend
      setDetails(data?.file); // Set file details
    } catch (error) {
      console.error("Error in uploading file:", error);
      setDetails({ error: "Failed to upload the file. Please try again." });
    }
  };

  // Automatically upload the file whenever a new file is selected
  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  // Trigger the hidden file input click
  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100 text-gray-800 p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Simple File Sharing</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Upload a file and share the download link instantly.
      </p>

      {/* Upload Button */}
      <button
        onClick={onUploadClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Upload File
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Display download link or error */}
      {url ? (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <p className="text-lg font-semibold text-gray-800">
            Your file is ready to download:
          </p>
          <h3 className="text-gray-600">{details?.name}</h3>
          <a
            href={url}
            download
            className="text-indigo-500 hover:text-indigo-700 underline mt-2 inline-block"
          >
            Click here to download
          </a>
        </div>
      ) : details?.error ? (
        <p className="mt-6 text-red-500 font-medium">{details.error}</p>
      ) : null}
    </div>
  );
}

export default App;
