import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';

const Summary = () => {
  const location = useLocation();
  const summaryInit = location.state?.summary || '';
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [asDoc, setAsDoc] = useState(false);
  const [editableSummary, setEditableSummary] = useState(summaryInit);
  const [isEditing, setIsEditing] = useState(false);

  const handleSendEmail = async () => {
    setMessage('');
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }
    setSending(true);
    try {
      const res = await axios.post('https://ai-metting-notes-summarizer-backend.onrender.com/api/summary/send-email', {
        to: email,
        subject: 'Your AI Summary',
        text: editableSummary,
        asDoc,
      });
      setMessage('Email sent successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  // Split summary into bullet points (by line or by numbered/list markers)
  const bulletPoints = editableSummary
    ? editableSummary.split(/\r?\n|•|\d+\./).filter(point => point.trim() !== '')
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center tracking-tight">Summary</h2>
        <div className="mb-8 text-gray-800 border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[120px]">
          {isEditing ? (
            <textarea
              value={editableSummary}
              onChange={e => setEditableSummary(e.target.value)}
              rows={Math.max(8, editableSummary.split('\n').length)}
              className="w-full h-full border border-blue-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
            />
          ) : bulletPoints.length > 0 ? (
            <div className="pl-2 space-y-2">
              {bulletPoints.map((point, idx) => {
                const trimmed = point.trim();
                // If point is a subheading (starts and ends with **)
                if (/^\*\*.*\*\*$/.test(trimmed)) {
                  return (
                    <div key={idx} className="font-bold text-blue-700 text-lg mt-4 mb-1">{trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '')}</div>
                  );
                }
                // Remove leading asterisks from normal points
                const cleaned = trimmed.replace(/^\*+\s*/, '');
                return (
                  <li key={idx} className="list-disc ml-6 text-lg">{cleaned}</li>
                );
              })}
            </div>
          ) : (
            <span>No summary available.</span>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`bg-gray-200 hover:bg-gray-300 text-blue-700 font-semibold py-2 px-4 rounded-lg transition duration-200 shadow ${isEditing ? 'border border-blue-400' : ''}`}
          >
            {isEditing ? 'Save Content' : 'Edit Content'}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email address to send summary"
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={asDoc}
              onChange={e => setAsDoc(e.target.checked)}
              className="accent-blue-600"
            />
            Send as DOCX attachment
          </label>
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sending}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {sending ? 'Sending...' : 'Send Summary via Email'}
          </button>
          {message && <div className="text-center text-sm mt-2 text-blue-700">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Summary;
