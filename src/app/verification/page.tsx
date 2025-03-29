'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, X, Upload, AlertCircle } from 'lucide-react';

export default function VerificationRequestForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    idType: 'passport',
    notes: '',
    documents: [] as File[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };
  
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.documents.length === 0) {
      setError('Please upload at least one document for verification');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // In a real implementation, this would call an API to submit the verification request
      // For now, we'll simulate a successful submission
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Redirect to profile page after a delay
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (err) {
      setError('An error occurred while submitting your verification request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Request Submitted</h2>
          <p className="text-gray-600 mt-2">
            Your verification request has been submitted successfully. We'll review your documents and update your account status.
          </p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            You'll be redirected to your profile page in a few seconds...
          </p>
          <Link 
            href="/profile" 
            className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Profile
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Verification Request</h1>
        <p className="text-gray-600 mt-2">
          Submit your verification request to get a trusted status on our platform
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle size={20} className="mt-0.5" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle size={20} className="mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Verification Information</p>
            <p className="text-sm mt-1">
              Verification helps establish trust in our community. Once verified, you'll receive a badge on your profile and gain access to additional features.
            </p>
            <p className="text-sm mt-1">
              The verification process typically takes 2-3 business days. You'll be notified via email once your request has been processed.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Legal Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your full legal name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
            ID Type
          </label>
          <select
            id="idType"
            name="idType"
            value={formData.idType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="passport">Passport</option>
            <option value="driverLicense">Driver's License</option>
            <option value="nationalId">National ID Card</option>
            <option value="businessLicense">Business License</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Documents
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="documents"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="documents"
                    name="documents"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                    accept="image/*,.pdf"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB each
              </p>
            </div>
          </div>
          
          {formData.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.documents.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Any additional information you'd like to provide"
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Verification Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
