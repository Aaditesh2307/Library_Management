import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  initializeContract, 
  isUserRegistered, 
  isAdmin as checkIsAdmin,
  getAllBooks as fetchAllBooks
} from '../utils/contract';

// Create context
const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);

  // Initialize the blockchain connection
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize contract
        const result = await initializeContract();
        
        if (result.success) {
          setConnected(true);
          setUserAddress(result.userAddress);
          
          // Check if user is registered
          const registered = await isUserRegistered();
          setIsRegistered(registered);
          
          // Check if user is admin
          const admin = await checkIsAdmin();
          setIsAdmin(admin);
          
          // Fetch books
          const allBooks = await fetchAllBooks();
          setBooks(allBooks);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error initializing blockchain:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          // Reload the page when account changes
          window.location.reload();
        } else {
          setConnected(false);
          setUserAddress('');
        }
      });
    }
  }, []);

  // Refresh books list
  const refreshBooks = async () => {
    try {
      const allBooks = await fetchAllBooks();
      setBooks(allBooks);
    } catch (err) {
      console.error('Error refreshing books:', err);
    }
  };

  // Context value
  const contextValue = {
    loading,
    error,
    connected,
    userAddress,
    isRegistered,
    isAdmin,
    books,
    refreshBooks
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook to use the blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}; 