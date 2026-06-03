/**
 * PageHeader — standard page title block used on catalog pages
 */
export default function PageHeader({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <div className="mb-10 animate-fade-in">
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="w-4 h-4 text-on-surface-variant" />}
          <span className="section-label">{eyebrow}</span>
        </div>
      )}
      <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">{title}</h1>
      {subtitle && (
        <p className="text-on-surface-variant text-base">{subtitle}</p>
      )}
    </div>
  );
}
