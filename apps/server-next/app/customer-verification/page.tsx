'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import TermsModal from '../components/TermsModal';

type VerificationResult = 'success' | 'failure' | null;

const CustomerVerification: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [showTerms, setShowTerms] = useState<boolean>(true);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage(file);
    setIsLoading(true);
    setVerificationResult(null);

    // Simulated verification logic
    setTimeout(() => {
      const isHuman = 0.8 > 0.5;
      setVerificationResult(isHuman ? 'success' : 'failure');
      setIsLoading(false);

      if (isHuman) {
        console.log('Image uploaded and link saved to DB');
        // TODO: actual API call to upload and store image
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      {/* {showTerms && (
        <TermsModal
          onAccept={() => setShowTerms(false)}
          onClose={() => router.push('/dashboard')}
        />
      )} */}

      <div className="bg-black p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Customer Verification</h1>

        <div className="flex justify-between mb-6 text-red-600">
          <div className={`flex-1 text-center ${step === 1 ? 'font-bold' : ''}`}>Step 1: Upload Image</div>
          <div className={`flex-1 text-center ${step === 2 ? 'font-bold' : ''}`}>Step 2: Upload Aadhaar/PAN</div>
          <div className={`flex-1 text-center ${step === 3 ? 'font-bold' : ''}`}>Step 3: Live Verification</div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
            <p className="mb-4">Please upload a clear image of yourself.</p>
            <input type="file" accept="image/*" className="mb-4" onChange={handleImageUpload} />
            {isLoading && <p className="text-blue-600">Verifying image...</p>}
            {verificationResult === 'success' && <p className="text-green-600">Image verified successfully!</p>}
            {verificationResult === 'failure' && <p className="text-red-600">Image verification failed. Try again.</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Aadhaar/PAN</h2>
            <p className="mb-4">Upload front and rear image of Aadhaar or PAN card.</p>
            <input type="file" className="mb-2" />
            <input type="file" className="mb-2" />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Facial Verification</h2>
            <p className="mb-4">Please enable camera for live facial check.</p>
            <div className="bg-gray-200 h-48 flex items-center justify-center mb-4 rounded">
              <p>Webcam Feed Placeholder</p>
            </div>
          </div>
        )}

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

      {/* Terms Section */}
        <div className="fixed bottom-0 left-0 right-0 mt-8 p-4 border-t border-gray-300 text-sm text-gray-600 bg-gray-50 rounded-md">
        <h2 className="font-semibold mb-2 text-gray-800">Terms & Conditions</h2>
        <ul className="list-disc pl-5 space-y-1">
            <li>You must not go back once you proceed to the next step.</li>
            <li>If you leave this page, the entire process will be reset.</li>
            <li>Your image will be stored securely for verification purposes.</li>
        </ul>
        </div>
    </div>
  );
};

export default CustomerVerification;
