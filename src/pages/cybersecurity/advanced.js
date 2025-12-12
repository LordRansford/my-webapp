import React, { useEffect, useMemo, useState } from "react";
import { NotesLayout } from "@/components/notes/NotesLayout";
import { useNotes } from "@/components/notes/NotesProvider";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { PrintSummary } from "@/components/notes/PrintSummary";
import ToolCard from "@/components/notes/ToolCard";
import { NoteImage, NoteVideo } from "@/components/notes/NoteMedia";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import { Callout } from "@/components/notes/Callout";
import { MathInline, MathBlock } from "@/components/notes/Math";
import Link from "next/link";
import ThreatModelCanvasTool from "@/components/notes/tools/cybersecurity/ch3/ThreatModelCanvasTool";
import AttackChainTool from "@/components/notes/tools/cybersecurity/ch3/AttackChainTool";
import ControlMappingTool from "@/components/notes/tools/cybersecurity/ch3/ControlMappingTool";
import ZeroTrustPolicyTool from "@/components/notes/tools/cybersecurity/ch3/ZeroTrustPolicyTool";
import LogStoryTool from "@/components/notes/tools/cybersecurity/ch3/LogStoryTool";
import IncidentTriageTool from "@/components/notes/tools/cybersecurity/ch3/IncidentTriageTool";
import VulnerabilityLifecycleTool from "@/components/notes/tools/cybersecurity/ch3/VulnerabilityLifecycleTool";
import BackupRansomwareRecoveryTool from "@/components/notes/tools/cybersecurity/ch3/BackupRansomwareRecoveryTool";

/*
Cybersecurity Notes
Chapter 3: Threats, Defence in Depth, and Response

Design principles
- One calm, scrollable narrative
- Tools are optional and hidden by default in institutional mode
- No exploit code
- No fear-based language
- Story driven defensive thinking
*/

export default function Page({ source, headings, meta }) {
  const { prefs } = useNotes();
  const [activeId, setActiveId] = useState(headings?.[0]?.id || "");
  const [navOpen, setNavOpen] = useState(false);

  const tocIds = useMemo(() => headings.map((s) => s.id), [headings]);
  const h2Headings = useMemo(() => headings.filter((h) => h.depth === 2), [headings]);

  useEffect(() => {
    const onScroll = () => {
      let current = activeId;
      for (const id of tocIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
          break;
        }
      }
      if (current !== activeId) setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocIds, activeId]);

  const activeH2Id = useMemo(() => {
    if (!headings.length) return "";
    const current = headings.find((h) => h.id === activeId) || h2Headings[0];
    if (!current) return "";
    if (current.depth === 2) return current.id;
    let parent = "";
    for (const h of headings) {
      if (h.depth === 2) parent = h.id;
      if (h.id === current.id) break;
    }
    return parent || h2Headings[0]?.id || "";
  }, [activeId, headings, h2Headings]);

  const h3ForActive = useMemo(() => {
    const list = [];
    let currentH2 = "";
    for (const h of headings) {
      if (h.depth === 2) currentH2 = h.id;
      if (h.depth === 3 && currentH2 === activeH2Id) list.push(h);
    }
    return list;
  }, [headings, activeH2Id]);

  const showTools = !prefs.institutionalMode && !prefs.hideTools;

  const mdxComponents = useMemo(
    () => ({
      DeeperDive,
      ToolCard,
      NoteImage,
      NoteVideo,
      Callout,
      MathInline,
      MathBlock,
      ThreatModelCanvasTool: showTools ? ThreatModelCanvasTool : () => null,
      AttackChainTool: showTools ? AttackChainTool : () => null,
      ControlMappingTool: showTools ? ControlMappingTool : () => null,
      ZeroTrustPolicyTool: showTools ? ZeroTrustPolicyTool : () => null,
      LogStoryTool: showTools ? LogStoryTool : () => null,
      IncidentTriageTool: showTools ? IncidentTriageTool : () => null,
      VulnerabilityLifecycleTool: showTools ? VulnerabilityLifecycleTool : () => null,
      BackupRansomwareRecoveryTool: showTools ? BackupRansomwareRecoveryTool : () => null,
      PrintSummary,
    }),
    [showTools]
  );

  return (
    <NotesLayout
      pageKey="cybersecurity-chapter-3"
      title="Cybersecurity Notes"
      subtitle={meta?.description || "Chapter 3: How attacks really happen, why humans are targeted, and how defence in depth prevents small mistakes becoming disasters."}
    >
      <nav className="panel stack" style={{ marginBottom: "1rem" }} aria-label="Cybersecurity pages">
        <div className="panel__header">
          <p className="eyebrow">Cybersecurity notes</p>
          <span className="muted">You are on Chapter 3 (Advanced)</span>
        </div>
        <div className="control-row">
          {[
            { slug: "/cybersecurity/beginner", label: "Chapter 1", hint: "Beginner foundations" },
            { slug: "/cybersecurity/intermediate", label: "Chapter 2", hint: "Intermediate" },
            { slug: "/cybersecurity/advanced", label: "Chapter 3", hint: "Advanced" },
            { slug: "/cybersecurity/summary", label: "Summary", hint: "Recap & game" },
          ].map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={`pill ${item.slug === "/cybersecurity/advanced" ? "pill--accent" : "pill--ghost"}`}
              aria-current={item.slug === "/cybersecurity/advanced" ? "page" : undefined}
            >
              {item.label} <span className="muted" style={{ fontSize: "0.9em" }}>· {item.hint}</span>
            </Link>
          ))}
        </div>
      </nav>
      <button className="toc-button" onClick={() => setNavOpen(true)} aria-label="Open contents">
        Contents
      </button>
      {navOpen && (
        <div className="notes-nav--drawer" role="dialog" aria-modal="true" onClick={() => setNavOpen(false)}>
          <div className="notes-nav__panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0 }}>Contents</h4>
              <button className="button ghost" onClick={() => setNavOpen(false)}>
                Close
              </button>
            </div>
            <ul>
              {h2Headings.map((h2) => (
                <li key={h2.id}>
                  <a
                    className={activeH2Id === h2.id ? "is-active" : ""}
                    href={`#${h2.id}`}
                    onClick={() => setNavOpen(false)}
                  >
                    <span>{h2.title}</span>
                  </a>
                  {activeH2Id === h2.id && h3ForActive.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        margin: "0.2rem 0 0 0.5rem",
                        padding: 0,
                        display: "grid",
                        gap: "0.15rem",
                      }}
                    >
                      {h3ForActive.map((h3) => (
                        <li key={h3.id}>
                          <a href={`#${h3.id}`} onClick={() => setNavOpen(false)} className={activeId === h3.id ? "is-active" : ""}>
                            <span style={{ fontSize: "0.85rem" }}>{h3.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="notes-grid">
        <aside className="notes-nav" aria-label="Contents">
          <h4>Contents</h4>
          <ul>
            {h2Headings.map((s) => (
              <li key={s.id}>
                <a className={activeH2Id === s.id ? "is-active" : ""} href={`#${s.id}`}>
                  <span>{s.title}</span>
                </a>
                {activeH2Id === s.id && h3ForActive.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "0.2rem 0 0 0.5rem",
                      padding: 0,
                      display: "grid",
                      gap: "0.15rem",
                    }}
                  >
                    {h3ForActive.map((h3) => (
                      <li key={h3.id}>
                        <a href={`#${h3.id}`} className={activeId === h3.id ? "is-active" : ""}>
                          <span style={{ fontSize: "0.85rem" }}>{h3.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <article className="mx-auto note-article note-article--wide text-[17px] leading-[1.85] text-gray-800">
          <MDXRenderer source={source} components={mdxComponents} />
        </article>
      </div>
      <div className="actions" style={{ marginTop: "1.5rem" }}>
        <Link href="/cybersecurity/summary" className="button primary">
          Next: Summary
        </Link>
      </div>
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch3.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
      meta: note.meta,
    },
  };
}
