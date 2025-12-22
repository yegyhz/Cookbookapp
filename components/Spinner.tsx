import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = 'currentColor', className = '' }) => {
  let spinnerSize = 'h-5 w-5'; // default medium
  if (size === 'small') {
    spinnerSize = 'h-4 w-4';
  } else if (size === 'large') {
    spinnerSize = 'h-8 w-8';
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${spinnerSize} ${className}`}
      style={{ color: color }}
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span>
    </div>
  );
};

export default Spinner;
