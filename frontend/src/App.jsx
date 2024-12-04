import { useRef, useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState();
  const fileInputRef = useRef();
  const [url, setUrl] = useState();
  const [details,setDetails] = useState();

  const uploadFile = async () => {
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("name", file.name);
      try {
        const response = await fetch("https://filesharingapp-i2un.onrender.com/upload", {
          method: "POST",
          body: formdata,
        });
        const data = await response.json();
        setUrl(data?.path); // Store the path returned from the backend
        setDetails(data?.file);
      } catch (error) {
        console.log("Error in uploading file", error);
      }
    }
  };

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100 text-gray-800 p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        Simple File Sharing
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Upload a file and share the download link instantly.
      </p>
      <button
        onClick={onUploadClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Upload File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={(e) => setFile(e.target.files[0])}
      />
      {url && (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <p className="text-lg font-semibold text-gray-800">
            Your file is ready to download:
          </p>
          <h3>{details?.name}</h3>
          <a
            href={url}
            download
            className="text-indigo-500 hover:text-indigo-700 underline mt-2 inline-block"
          >
            Click here to download
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
