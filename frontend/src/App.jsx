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

  // Function to copy the link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-gray-800 p-4 sm:p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900">
          Simple File Sharing
        </h1>
        <p className="text-sm sm:text-base text-gray-700 text-center">
          Upload a file and share the download link instantly. Files are securely stored for easy sharing.
        </p>

        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Your file is ready to share:
            </p>
            <h3 className="text-gray-900 font-medium truncate">{details?.name}</h3>
            <div className="flex items-center justify-center space-x-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-indigo-600 hover:text-indigo-800 transition"
              >
                {url}
              </a>
              <button
                onClick={copyToClipboard}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md"
              >
                Copy
              </button>
            </div>
          </div>
        ) : details?.error ? (
          <p className="text-red-500 text-center font-medium">{details.error}</p>
        ) : null}
      </div>
    </div>
  );
}

export default App;
