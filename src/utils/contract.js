import { ethers } from 'ethers';

// ABI will be generated when we compile the contract
const contractABI = []; // TODO: Add contract ABI after compilation
const contractAddress = ''; // TODO: Add contract address after deployment

let libraryContract = null;
let signer = null;

// Initialize contract connection
export const initializeContract = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install it to use this app.');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get the signer
    signer = await provider.getSigner();
    
    // Create contract instance
    libraryContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    return { success: true, contract: libraryContract, userAddress: await signer.getAddress() };
  } catch (error) {
    console.error('Error initializing contract:', error);
    return { success: false, error: error.message };
  }
};

// Check if user is registered
export const isUserRegistered = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const userAddress = await signer.getAddress();
    return await libraryContract.registeredUsers(userAddress);
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

// Register user
export const registerUser = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.registerUser();
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// Add a book (admin only)
export const addBook = async (title, author, copies) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.addBook(title, author, copies);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: error.message };
  }
};

// Update a book (admin only)
export const updateBook = async (bookId, title, author, copies) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.updateBook(bookId, title, author, copies);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: error.message };
  }
};

// Borrow a book
export const borrowBook = async (bookId) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.borrowBook(bookId);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error borrowing book:', error);
    return { success: false, error: error.message };
  }
};

// Return a book
export const returnBook = async (bookId) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.returnBook(bookId);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error returning book:', error);
    return { success: false, error: error.message };
  }
};

// Get all books
export const getAllBooks = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const books = await libraryContract.getAllBooks();
    
    // Format books data
    return books.map(book => ({
      id: Number(book.id),
      title: book.title,
      author: book.author,
      copies: Number(book.copies),
      availableCopies: Number(book.availableCopies)
    }));
  } catch (error) {
    console.error('Error getting all books:', error);
    return [];
  }
};

// Get user borrowings
export const getUserBorrowings = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const borrowings = await libraryContract.getUserBorrowings();
    
    // Format borrowings data
    return borrowings.map(borrowing => ({
      bookId: Number(borrowing.bookId),
      borrowDate: new Date(Number(borrowing.borrowDate) * 1000),
      returnDate: borrowing.returnDate > 0 ? new Date(Number(borrowing.returnDate) * 1000) : null,
      returned: borrowing.returned
    }));
  } catch (error) {
    console.error('Error getting user borrowings:', error);
    return [];
  }
};

// Check if user is admin
export const isAdmin = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const admin = await libraryContract.admin();
    const userAddress = await signer.getAddress();
    return admin.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    if (!libraryContract) await initializeContract();
    return await libraryContract.getAllUsers();
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}; 