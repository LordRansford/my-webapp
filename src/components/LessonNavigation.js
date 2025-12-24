import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function LessonNavigation({ courseSlug, lessons = [], active }) {
  const [isCourseRoute, setIsCourseRoute] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location?.pathname || "";
    setIsCourseRoute(path.startsWith("/courses/"));
  }, []);
  if (!isCourseRoute) return null;

  return (
    <aside className="lesson-nav" aria-label="Course lessons">
      <p className="eyebrow">Lessons</p>
      <div className="lesson-list">
        {lessons.map((lesson) => {
          const isActive = lesson.slug === active;
          return (
            <Link
              key={lesson.slug}
              href={`/courses/${courseSlug}/${lesson.slug}`}
              className={`lesson-list__item ${isActive ? "is-active" : ""}`}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <div className="lesson-list__copy">
                <span className="lesson-title">{lesson.meta.title}</span>
                {lesson.meta.description && (
                  <span className="lesson-desc">{lesson.meta.description}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
