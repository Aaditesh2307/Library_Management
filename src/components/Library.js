import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { registerUser, borrowBook, returnBook } from '../utils/contract';
import BookList from './BookList';
import BookForm from './BookForm';
import BorrowingsList from './BorrowingsList';
import ConnectWallet from './ConnectWallet';

const Library = () => {
  const { 
    loading, 
    error, 
    connected, 
    userAddress, 
    isRegistered, 
    isAdmin,
    refreshBooks
  } = useBlockchain();
  
  const [activeTab, setActiveTab] = useState('books');
  const [registering, setRegistering] = useState(false);
  
  // Handle user registration
  const handleRegister = async () => {
    try {
      setRegistering(true);
      const result = await registerUser();
      if (result.success) {
        window.location.reload(); // Reload to update registration status
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      alert(`Registration failed: ${err.message}`);
    } finally {
      setRegistering(false);
    }
  };
  
  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      const result = await borrowBook(bookId);
      if (result.success) {
        alert('Book borrowed successfully');
        refreshBooks();
      } else {
        alert(`Failed to borrow book: ${result.error}`);
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      alert(`Failed to borrow book: ${err.message}`);
    }
  };
  
  // Handle returning a book
  const handleReturn = async (bookId) => {
    try {
      const result = await returnBook(bookId);
      if (result.success) {
        alert('Book returned successfully');
        refreshBooks();
      } else {
        alert(`Failed to return book: ${result.error}`);
      }
    } catch (err) {
      console.error('Error returning book:', err);
      alert(`Failed to return book: ${err.message}`);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <ConnectWallet />
      </div>
    );
  }
  
  if (!connected) {
    return <ConnectWallet />;
  }
  
  if (!isRegistered) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to the Library</h2>
        <p className="mb-6">You need to register to use the library system.</p>
        <p className="mb-4 text-gray-600 text-sm">Your address: {userAddress}</p>
        <button
          onClick={handleRegister}
          disabled={registering}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {registering ? 'Registering...' : 'Register'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">
          <p><span className="font-semibold">Address:</span> {userAddress}</p>
          <p><span className="font-semibold">Role:</span> {isAdmin ? 'Admin' : 'User'}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('books')}
            className={`${
              activeTab === 'books' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } px-4 py-2 rounded-md font-medium`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('borrowings')}
            className={`${
              activeTab === 'borrowings' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } px-4 py-2 rounded-md font-medium`}
          >
            My Borrowings
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('add')}
              className={`${
                activeTab === 'add' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } px-4 py-2 rounded-md font-medium`}
            >
              Add Book
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'books' && (
          <BookList onBorrow={handleBorrow} />
        )}
        
        {activeTab === 'borrowings' && (
          <BorrowingsList onReturn={handleReturn} />
        )}
        
        {activeTab === 'add' && isAdmin && (
          <BookForm onAddSuccess={refreshBooks} />
        )}
      </div>
    </div>
  );
};

export default Library; 