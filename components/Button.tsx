import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 font-body font-medium text-sm transition-all duration-300 rounded-full tracking-wide";
  
  const variants = {
    primary: "bg-brand-accent hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-1",
    secondary: "bg-white text-black hover:bg-gray-200 shadow-lg transform hover:-translate-y-1",
    outline: "border border-neutral-700 text-neutral-300 hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};