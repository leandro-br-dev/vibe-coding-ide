import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const loadingClass = loading ? 'btn-loading' : '';

  const combinedClassName = [baseClass, variantClass, sizeClass, loadingClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={combinedClassName} disabled={disabled || loading} {...props}>
      {loading && <span className="btn-spinner" />}
      <span className="btn-content">{children}</span>
    </button>
  );
};
