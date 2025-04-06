import React from 'react';
import { initializeContract } from '../utils/contract';

const ConnectWallet = () => {
  const handleConnect = async () => {
    try {
      await initializeContract();
      // Reload page after connection to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6">Welcome to Library Management System</h2>
      
      <p className="mb-8 text-gray-600">
        Connect your wallet to manage books in our decentralized library system.
      </p>
      
      <button
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-sm transition duration-150 ease-in-out"
      >
        Connect MetaMask
      </button>
      
      <p className="mt-4 text-sm text-gray-500">
        Make sure you have MetaMask installed and set up.
      </p>
    </div>
  );
};

export default ConnectWallet; 