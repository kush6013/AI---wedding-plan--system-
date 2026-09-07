// Button component - reusable button with different variants
// Variants: primary, secondary, danger
// Props: children (button text), onClick, disabled, variant, type, className

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
