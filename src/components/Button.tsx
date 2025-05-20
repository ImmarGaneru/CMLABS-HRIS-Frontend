import React, { ReactNode } from 'react';

// Define possible props for the button
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'tableFeatureButton' | 'redirectButton';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  // Define dynamic classes based on variant
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors duration-200 flex items-center gap-2';

  const variantStyles = {
    primary: 'bg-[#1E3A5F] text-white hover:bg-[#155A8A]',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    tableFeatureButton: 'bg-[#f8f8f8] border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#e8e8e8] text-sm rounded-md',
    redirectButton:'flex items-center gap-2 bg-[#1E3A5F] text-white text-sm px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out cursor-pointer',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;