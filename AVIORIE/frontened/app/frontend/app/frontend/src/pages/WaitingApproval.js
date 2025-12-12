import React from 'react';
import { Clock, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const WaitingApproval = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-sky-100 text-center">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-sky-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Aviorie</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">Waiting for Approval</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for registering! Your account is currently pending approval from the administrator. 
            You will be able to access your dashboard once approved.
          </p>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 mb-8">
            <p className="text-sm text-sky-800 font-medium">
              <span className="block mb-2">🔔 You will receive a notification once approved</span>
              <span className="block">Please check back later or contact support</span>
            </p>
          </div>

          <Button
            data-testid="back-home-btn"
            onClick={handleBackToHome}
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full py-6 font-semibold"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;
