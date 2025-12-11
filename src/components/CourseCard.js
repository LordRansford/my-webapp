import Link from "next/link";
import { ArrowRight, Clock3, Shield } from "lucide-react";

export default function CourseCard({ course }) {
  const { slug, meta } = course;

  return (
    <Link href={`/courses/${slug}`} className="course-card">
      <div className="course-card__meta">
        <span className="chip chip--accent">{meta.level || "Self-paced"}</span>
        {meta.duration && (
          <span className="chip chip--ghost">
            <Clock3 size={14} aria-hidden="true" />
            {meta.duration}
          </span>
        )}
      </div>
      <h3>{meta.title}</h3>
      {meta.tagline && <p className="muted">{meta.tagline}</p>}
      <div className="course-card__tags">
        {meta.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="pill">
            <Shield size={12} aria-hidden="true" />
            {tag}
          </span>
        ))}
      </div>
      <div className="course-card__footer">
        <span className="footnote">
          {meta.lessonCount ? `${meta.lessonCount} lessons` : "Course outline"}
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </div>
    </Link>
  );
}
