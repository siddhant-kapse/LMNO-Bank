import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsModal from '../components/TermsModal';
// import axios from 'axios';

const CustomerVerification = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showTerms, setShowTerms] = useState(true);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/dashboard'); // Redirect to dashboard after completion
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsLoading(true);
    setVerificationResult(null);
  
    // Prepare the file for upload
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      // Call the Python backend for verification
      const response = await axios.post('http://localhost:8000/verify-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.status === 'success') {
        setVerificationResult('success');
        const s3Link = response.data.s3_link;
        console.log('Image uploaded to S3:', s3Link);
        // Save S3 link in MongoDB (we'll implement this next)
      } else {
        setVerificationResult('failure');
      }
    } catch (error) {
      console.error('Error verifying image:', error);
      setVerificationResult('failure');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {showTerms && (
        <TermsModal
          onAccept={() => setShowTerms(false)}
          onClose={() => navigate('/dashboard')}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Customer Verification</h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          <div className={`flex-1 text-center ${step === 1 ? 'font-bold' : ''}`}>Step 1: Upload Image</div>
          <div className={`flex-1 text-center ${step === 2 ? 'font-bold' : ''}`}>Step 2: Upload Aadhaar/PAN</div>
          <div className={`flex-1 text-center ${step === 3 ? 'font-bold' : ''}`}>Step 3: Live Verification</div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
            <p className="mb-4">Please upload a clear image of yourself.</p>
            <input type="file" className="mb-4" onChange={handleImageUpload} />
            {isLoading && <p className="text-blue-600">Verifying image...</p>}
            {verificationResult === 'success' && (
              <p className="text-green-600">Image verified successfully! You can proceed.</p>
            )}
            {verificationResult === 'failure' && (
              <p className="text-red-600">Image verification failed. Please upload a valid image.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Aadhaar/PAN</h2>
            <p className="mb-4">Please upload the front and back of your Aadhaar or PAN card.</p>
            <input type="file" className="mb-4" />
            <input type="file" className="mb-4" />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Facial Verification</h2>
            <p className="mb-4">Please turn on your camera for live facial verification.</p>
            <div className="bg-gray-200 h-48 flex items-center justify-center mb-4">
              <p>Webcam Feed Placeholder</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 && verificationResult !== 'success'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerVerification;