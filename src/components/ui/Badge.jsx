/**
 * Badge — universal badge/tag component
 * variants: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline'
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'badge-outline',
    primary: 'badge-indigo',
    success: 'badge-green',
    warning: 'badge-amber',
    error: 'badge-error',
    outline: 'badge-outline',
  };

  return (
    <span className={`badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
