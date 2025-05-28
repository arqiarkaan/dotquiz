import React from 'react';
import DotquizLogo from './DotquizLogo';

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  username,
  onLogout,
  showLogout = false,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-primary-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <DotquizLogo size={32} />
          <h1 className="text-2xl font-bold text-primary-600">dotquiz</h1>
        </div>

        {username && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Hello,{' '}
              <span className="font-semibold text-primary-600">{username}</span>
            </span>
            {showLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                Logout{' '}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
