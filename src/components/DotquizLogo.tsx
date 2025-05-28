import React from 'react';

interface DotquizLogoProps {
  size?: number | string; // px atau rem
  className?: string;
}

const DotquizLogo: React.FC<DotquizLogoProps> = ({
  size = 32,
  className = '',
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {/* Outer static green layers */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full bg-green-400 opacity-30"
        style={{
          width: `calc(${dimension} * 0.875)`,
          height: `calc(${dimension} * 0.875)`,
          transform: 'translate(-50%, -50%)',
        }}
      ></span>
      <span
        className="absolute left-1/2 top-1/2 rounded-full bg-green-300 opacity-50"
        style={{
          width: `calc(${dimension} * 0.625)`,
          height: `calc(${dimension} * 0.625)`,
          transform: 'translate(-50%, -50%)',
        }}
      ></span>
      {/* Inner solid green circle */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full bg-green-600 shadow-md"
        style={{
          width: `calc(${dimension} * 0.375)`,
          height: `calc(${dimension} * 0.375)`,
          transform: 'translate(-50%, -50%)',
        }}
      ></span>
    </div>
  );
};

export default DotquizLogo;
