export default function TemplateLicenceNotice({
  usageType = "commercial",
  author = "Ransford",
  brand = "Ransfords Notes",
  attributionText = "Created by Ransford for Ransfords Notes. Keep this notice on commercial exports.",
  onRequestOverride,
}) {
  const requiresAttribution = usageType === "commercial";

  return (
    <section
      className="template-licence-notice rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
      aria-labelledby="template-licence-title"
      role="contentinfo"
    >
      <h2 id="template-licence-title" className="template-licence-notice__title text-xl font-semibold text-slate-900">
        Licence and attribution notice
      </h2>

      <p className="template-licence-notice__summary mt-2 text-sm text-slate-700">
        Commercial downloads must retain author and brand attribution. Internal or personal use may
        remove attribution, but keep provenance where reasonable.
      </p>

      <div className="template-licence-notice__block mt-4 space-y-1 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <p className="template-licence-notice__attribution text-sm text-slate-800">{attributionText}</p>
        <p className="template-licence-notice__details text-xs uppercase tracking-wide text-slate-500">
          Author: {author} · Brand: {brand}
        </p>
      </div>

      {requiresAttribution ? (
        <div className="template-licence-notice__actions mt-4 space-y-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900" role="note">
          <p className="font-medium">
            To remove attribution for commercial use, obtain explicit permission or complete the
            approved donation flow.
          </p>
          <button
            type="button"
            onClick={() => onRequestOverride && onRequestOverride(usageType)}
            className="template-licence-notice__button inline-flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:w-auto"
          >
            Request permission / donation route
          </button>
        </div>
      ) : (
        <p className="template-licence-notice__actions mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900" role="note">
          Attribution may be removed for internal/personal use; keep provenance notes for audit
          trails.
        </p>
      )}

      <p className="template-licence-notice__placeholder mt-3 text-xs text-slate-500">
        Placeholder gating: enforce download-time checks before allowing attribution removal.
      </p>
    </section>
  );
}
