export default function CPDDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 ${className}`}>
      <p className="font-semibold text-slate-900">CPD learning platform</p>
      <p className="mt-1">
        This learning platform is designed to support independent CPD submissions. Formal accreditation is applied for separately.
      </p>
    </div>
  );
}
