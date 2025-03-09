import React, { useState } from 'react';

const TermsModal = ({ onAccept, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
        <p className="mb-4">
          By proceeding, you agree to the following:
          <ul className="list-disc pl-6">
            <li>You cannot go back once you proceed to the next step.</li>
            <li>If you cancel, the entire process will be reset.</li>
            <li>Your image will be stored securely for verification purposes.</li>
          </ul>
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Accept and Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;