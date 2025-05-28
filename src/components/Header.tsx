import React from 'react';
import DotquizLogo from './DotquizLogo';
import { LogOut } from 'lucide-react';

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
    <header className="bg-white/60 backdrop-blur-md shadow-sm border-b border-white/30">
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
                className="p-2 rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 hover:shadow-md hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
