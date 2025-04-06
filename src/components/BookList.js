import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';

const BookList = ({ onBorrow }) => {
  const { books, loading } = useBlockchain();

  if (loading) {
    return <div className="text-center py-4">Loading books...</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No books available in the library yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Author</th>
              <th className="py-2 px-4 border-b text-center">Total Copies</th>
              <th className="py-2 px-4 border-b text-center">Available</th>
              <th className="py-2 px-4 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{book.id}</td>
                <td className="py-2 px-4 border-b">{book.title}</td>
                <td className="py-2 px-4 border-b">{book.author}</td>
                <td className="py-2 px-4 border-b text-center">{book.copies}</td>
                <td className="py-2 px-4 border-b text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      book.availableCopies > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.availableCopies}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => onBorrow(book.id)}
                    disabled={book.availableCopies === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Borrow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList; 