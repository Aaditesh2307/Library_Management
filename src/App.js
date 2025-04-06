import React from 'react';
import './App.css';
import { BlockchainProvider } from './context/BlockchainContext';
import Library from './components/Library';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BlockchainProvider>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
              Blockchain Library Management System
            </h1>
          </header>
          <main>
            <Library />
          </main>
          <footer className="mt-12 text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Blockchain Library Management System</p>
          </footer>
        </div>
      </BlockchainProvider>
    </div>
  );
}

export default App;
