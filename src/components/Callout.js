import { Info, ShieldCheck, AlertTriangle } from "lucide-react";

const variants = {
  info: {
    icon: Info,
    className: "callout callout--info",
  },
  success: {
    icon: ShieldCheck,
    className: "callout callout--success",
  },
  warning: {
    icon: AlertTriangle,
    className: "callout callout--warning",
  },
};

export default function Callout({ title, type = "info", children }) {
  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  return (
    <div className={variant.className}>
      <div className="callout__header">
        <Icon size={18} aria-hidden="true" />
        {title && <p className="callout__title">{title}</p>}
      </div>
      <div className="callout__body">{children}</div>
    </div>
  );
}
