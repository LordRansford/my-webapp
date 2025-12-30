"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ExternalLink, Calendar, Building2 } from "lucide-react";
import type { NormalisedItem } from "@/lib/updates/types";
import ProvenanceBadge from "./ProvenanceBadge";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";
import { getCVSSScore, getSeverityLevel } from "@/utils/updates/cvss";

interface UpdateCardProps {
  item: NormalisedItem;
  audienceMode: "exec" | "engineer" | "learner";
  className?: string;
}

const UpdateCard = memo(function UpdateCard({
  item,
  audienceMode,
  className = "",
}: UpdateCardProps) {
  const getAudienceContent = () => {
    switch (audienceMode) {
      case "exec":
        return item.audience_notes.exec_brief;
      case "engineer":
        return item.audience_notes.engineer_detail;
      case "learner":
        return item.audience_notes.learner_explain;
    }
  };
  
  const getSeverityBadge = () => {
    if (!item.cve) return null;
    
    const score = getCVSSScore(item.cve);
    const severity = getSeverityLevel(score);
    
    const badges = {
      critical: <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded text-xs font-medium">Critical</span>,
      high: <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">High</span>,
      medium: <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Medium</span>,
      low: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Low</span>,
      none: null,
    };
    
    return badges[severity];
  };
  
  return (
    <article
      className={`rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>{item.publisher}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <time dateTime={item.published_at}>
                {new Date(item.published_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
        {getSeverityBadge()}
      </div>
      
      <div className="prose prose-sm max-w-none mb-4">
        <p className="text-slate-700">{getAudienceContent()}</p>
      </div>
      
      {item.topic_tags && item.topic_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.topic_tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <ProvenanceBadge
          licencePosture={item.licence_posture}
          sourceName={item.source_id}
          fetchedAt={item.fetched_at}
        />
        <div className="flex items-center gap-2">
          <BookmarkButton itemId={item.id} />
          <ShareButton item={item} />
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`View original source: ${item.title}`}
          >
            View Source
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
});

export default UpdateCard;
