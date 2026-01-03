import { useState } from 'react';
import SafeIcon from '@/components/content/SafeIcon';

export default function CaseStudy({ 
  id, 
  title, 
  summary, 
  industry,
  year,
  impact,
  learningObjectives = [],
  difficulty = "intermediate",
  children 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-50 text-green-700 border-green-200',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    advanced: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${difficultyColors[difficulty]}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              {industry && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {industry}
                </span>
              )}
              {year && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {year}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {summary && (
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{summary}</p>
            )}
            {impact && (
              <div className="mt-3 flex items-start gap-2">
                <SafeIcon name="alert-triangle" size={16} color="#DC2626" />
                <p className="text-sm font-semibold text-red-600">Impact: {impact}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse case study" : "Expand case study"}
          >
            <SafeIcon 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="currentColor" 
            />
          </button>
        </div>
        
        {learningObjectives.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Learning Objectives
            </p>
            <div className="flex flex-wrap gap-2">
              {learningObjectives.map((objective, index) => (
                <span 
                  key={index}
                  className="rounded-lg bg-white/80 px-3 py-1 text-xs text-gray-700 border border-gray-200"
                >
                  {objective}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 prose prose-sm max-w-none">
          {children}
        </div>
      )}
      
      {/* Footer with action hint */}
      {!isExpanded && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Click to read full case study →
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-components for structured case study content
export function Timeline({ children }) {
  return (
    <div className="my-4 space-y-3">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Timeline</h4>
      <div className="border-l-2 border-blue-300 pl-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

export function TimelineEvent({ date, children }) {
  return (
    <div className="relative">
      <div className="absolute -left-[1.3rem] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
      <p className="text-xs font-semibold text-blue-600 mb-1">{date}</p>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  );
}

export function RootCause({ children }) {
  return (
    <div className="my-4 rounded-lg bg-red-50 border border-red-200 p-4">
      <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-2 flex items-center gap-2">
        <SafeIcon name="alert-circle" size={16} color="#991B1B" />
        Root Cause
      </h4>
      <div className="text-sm text-red-800 prose prose-sm prose-red">
        {children}
      </div>
    </div>
  );
}

export function LessonsLearned({ children }) {
  return (
    <div className="my-4 rounded-lg bg-green-50 border border-green-200 p-4">
      <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide mb-2 flex items-center gap-2">
        <SafeIcon name="check-circle" size={16} color="#065F46" />
        Lessons Learned
      </h4>
      <div className="text-sm text-green-800 prose prose-sm prose-green">
        {children}
      </div>
    </div>
  );
}

export function TechnicalDetails({ children }) {
  return (
    <div className="my-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
        <SafeIcon name="cpu" size={16} color="#374151" />
        Technical Details
      </h4>
      <div className="text-sm text-gray-700 prose prose-sm">
        {children}
      </div>
    </div>
  );
}

export function ImpactAnalysis({ financial, operational, reputational, legal }) {
  return (
    <div className="my-4 rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Impact Analysis</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {financial && (
          <div className="flex items-start gap-2">
            <SafeIcon name="dollar-sign" size={16} color="#059669" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Financial</p>
              <p className="text-sm text-gray-800">{financial}</p>
            </div>
          </div>
        )}
        {operational && (
          <div className="flex items-start gap-2">
            <SafeIcon name="settings" size={16} color="#3B82F6" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Operational</p>
              <p className="text-sm text-gray-800">{operational}</p>
            </div>
          </div>
        )}
        {reputational && (
          <div className="flex items-start gap-2">
            <SafeIcon name="users" size={16} color="#8B5CF6" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Reputational</p>
              <p className="text-sm text-gray-800">{reputational}</p>
            </div>
          </div>
        )}
        {legal && (
          <div className="flex items-start gap-2">
            <SafeIcon name="shield" size={16} color="#DC2626" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Legal/Regulatory</p>
              <p className="text-sm text-gray-800">{legal}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
