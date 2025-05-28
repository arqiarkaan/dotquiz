
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage } from '@/utils/storage';
import Header from './Header';

interface LoginPageProps {
  onLogin: (username: string) => void;
  savedUsername?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, savedUsername }) => {
  const [username, setUsername] = useState(savedUsername || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    storage.saveUsername(username.trim());
    onLogin(username.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">•</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to dotquiz</h2>
              <p className="text-gray-600">Test your knowledge with our interactive quiz</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  className="w-full h-12 text-lg"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                Start Quiz
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Ready to challenge yourself?</p>
              <p className="font-medium text-primary-600">Good luck! 🍀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
