"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import mdxComponents from "@/components/mdx-components";
import { BookOpen, Clock, Download } from "lucide-react";
import { generatePostPDF } from "@/lib/pdf/generatePostPDF";
import { saveAs } from "file-saver";

interface BlogPostLayoutProps {
  post: {
    title: string;
    excerpt?: string;
    date?: string;
    readingStats?: { minutes: number };
    tags?: string[];
    mdx: any;
  };
  showTOC?: boolean;
}

export default function BlogPostLayout({ post, showTOC = true }: BlogPostLayoutProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract headings from content
  useEffect(() => {
    const article = document.querySelector(".blog-post-content");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3");
    const extracted: Array<{ id: string; text: string; level: number }> = [];

    headingElements.forEach((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      if (!el.id) el.id = id;
      extracted.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName.charAt(1)),
      });
    });

    setHeadings(extracted);
  }, [post.mdx]);

  // Track active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -60% 0%" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector(".blog-post-content");
      if (!article) return;

      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleHeight = article.getBoundingClientRect().height;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const progress = Math.min(
        100,
        Math.max(0, ((scrollTop + windowHeight - articleTop) / articleHeight) * 100)
      );
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownloadPDF = async () => {
    if (!contentRef.current || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    try {
      // Get the article element that contains the content
      const articleElement = contentRef.current;
      
      // Generate PDF with watermark
      const pdfBlob = await generatePostPDF(post.title, articleElement, "Ransford's Notes");
      
      // Download the PDF
      const fileName = `${post.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const hasHeadings = headings.length > 0 && showTOC;

  return (
    <div className="blog-post-wrapper">
      {/* Reading Progress Bar */}
      {readingProgress > 0 && readingProgress < 100 && (
        <div className="blog-reading-progress">
          <div
            className="blog-reading-progress__bar"
            style={{ width: `${readingProgress}%` }}
            aria-hidden="true"
          />
        </div>
      )}

      <article className="blog-post">
        {/* Header */}
        <header className="blog-post__header">
          <nav className="blog-post__breadcrumb" aria-label="Breadcrumb">
            <Link href="/posts" className="blog-post__breadcrumb-link">
              Notes
            </Link>
            <span aria-hidden="true" className="blog-post__breadcrumb-separator">
              {" "}/{" "}
            </span>
            <span className="blog-post__breadcrumb-current">{post.title}</span>
          </nav>

          <div className="blog-post__meta">
            <p className="blog-post__eyebrow">Article</p>
            <h1 className="blog-post__title">{post.title}</h1>
            {post.excerpt && <p className="blog-post__excerpt">{post.excerpt}</p>}

            <div className="blog-post__meta-row">
              {post.date && (
                <time
                  dateTime={post.date}
                  className="blog-post__date"
                >
                  {new Intl.DateTimeFormat("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(post.date))}
                </time>
              )}
              {post.readingStats && (
                <span className="blog-post__reading-time">
                  <Clock className="blog-post__icon" aria-hidden="true" />
                  {Math.ceil(post.readingStats.minutes)} min read
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="blog-post__tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="blog-post__tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="blog-post__actions">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="blog-post__download-btn"
                aria-label="Download as PDF"
              >
                <Download className="blog-post__download-icon" aria-hidden="true" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="blog-post__body">
          {/* Table of Contents */}
          {hasHeadings && (
            <aside className="blog-post__toc" aria-label="Table of contents">
              <div className="blog-post__toc-header">
                <BookOpen className="blog-post__toc-icon" aria-hidden="true" />
                <h2 className="blog-post__toc-title">Contents</h2>
              </div>
              <nav className="blog-post__toc-nav">
                <ul className="blog-post__toc-list">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={`blog-post__toc-item blog-post__toc-item--level-${heading.level}`}
                    >
                      <a
                        href={`#${heading.id}`}
                        className={`blog-post__toc-link ${
                          activeHeading === heading.id ? "blog-post__toc-link--active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                          window.history.pushState(null, "", `#${heading.id}`);
                        }}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Content */}
          <div ref={contentRef} className="blog-post-content">
            <MDXRemote {...post.mdx} components={mdxComponents} />
          </div>
        </div>
      </article>
    </div>
  );
}

