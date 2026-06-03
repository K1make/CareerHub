/**
 * EmptyState — shown when a list has no results
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center glass-card">
      {Icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-container border border-outline-variant mb-5">
          <Icon className="w-6 h-6 text-outline" />
        </div>
      )}
      <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-secondary text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
