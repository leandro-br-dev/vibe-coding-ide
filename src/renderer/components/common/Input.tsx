import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  const inputClassName = [
    'input',
    hasError ? 'input-error' : '',
    leftIcon ? 'input-with-left-icon' : '',
    rightIcon ? 'input-with-right-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}

      <div className="input-container">
        {leftIcon && <div className="input-icon input-icon-left">{leftIcon}</div>}

        <input id={inputId} className={inputClassName} {...props} />

        {rightIcon && <div className="input-icon input-icon-right">{rightIcon}</div>}
      </div>

      {error && <div className="input-error-message">{error}</div>}
      {hint && !error && <div className="input-hint">{hint}</div>}
    </div>
  );
};
