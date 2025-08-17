import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Home = () => {
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setError("");
    const file = fileInputRef.current.files[0];
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    try {
      // Send file and prompt to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);
      const res = await axios.post("/api/summary/upload", formData, {
        baseURL: "http://localhost:3000",
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Show toast and redirect after short delay
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/summary', { state: { summary: res.data.summary || "No summary found." } });
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">AI Powered Note Summarizer</h1>
          <p className="text-gray-600 mb-6 text-center">Upload your PDF or DOCX file and get a smart summary instantly.</p>
          <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="block w-full h-10 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter your prompt (e.g. Summarize the document)"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Generate Summary'}
            </button>
          </form>
          {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
          {/* Toast notification */}
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
              Redirecting to summary page...
            </div>
          )}
        </div>
      </div>
      <footer className="w-full text-gray-500 text-xs text-center py-4 mt-auto">&copy; 2025 AI Powered Note Summarizer</footer>
    </div>
  );
};

export default Home;