"use client";

import React, { useMemo } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { exportCpdCsv, exportCpdJson, listCpdRecords, totalHours, getCpdUserId } from "@/lib/cpdRecords";
import { saveAs } from "file-saver";

export default function CpdRecordPage() {
  const records = useMemo(() => listCpdRecords(), []);
  const hours = useMemo(() => totalHours(records), [records]);

  const exportFile = (format: "csv" | "json") => {
    const blob = format === "csv" ? exportCpdCsv(records) : exportCpdJson(records);
    saveAs(blob, `cpd-records.${format}`);
  };

  const exportCertificate = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setAuthor("Ransford Amponsah");
    pdfDoc.setProducer("Ransford's Notes");
    const page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const draw = (text: string, x: number, y: number, size = 14) => page.drawText(text, { x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
    let y = 720;
    draw("CPD Certificate", 200, y, 20);
    y -= 24;
    draw(`Learner ID: ${getCpdUserId()}`, 50, y);
    y -= 18;
    draw(`Activities recorded: ${records.length}`, 50, y);
    y -= 18;
    draw(`Total hours: ${hours.toFixed(2)}`, 50, y);
    y -= 18;
    draw("Statement: This activity is designed in line with CPD best practice.", 50, y, 12);
    y -= 18;
    draw("Ransford's Notes — CPD Learning Record", 50, y, 12);
    const pdfBytes = await pdfDoc.save();
    const view = pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes as ArrayBufferLike);
    const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
    const blob = new Blob([buffer], { type: "application/pdf" });
    saveAs(blob, "cpd-certificate.pdf");
  };

  const exportEvidencePack = async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const addPage = (title: string) => {
      const p = pdfDoc.addPage([612, 792]);
      p.drawText(title, { x: 50, y: 740, size: 18, font, color: rgb(0.1, 0.1, 0.1) });
      return p;
    };
    const first = addPage("CPD Evidence Pack");
    first.drawText(`Learner ID: ${getCpdUserId()}`, { x: 50, y: 720, size: 12, font });
    first.drawText(`Total hours: ${hours.toFixed(2)}`, { x: 50, y: 700, size: 12, font });
    let y = 680;
    records.slice(0, 15).forEach((rec) => {
      first.drawText(`${new Date(rec.completedAt).toLocaleDateString()} - ${rec.itemId} (${rec.activityType}) - ${rec.timeMinutes} mins`, {
        x: 50,
        y,
        size: 11,
        font,
      });
      y -= 16;
    });
    records.forEach((rec) => {
      const p = addPage(`Activity: ${rec.itemId}`);
      p.drawText(`Type: ${rec.activityType}`, { x: 50, y: 720, size: 12, font });
      p.drawText(`Minutes: ${rec.timeMinutes}`, { x: 50, y: 702, size: 12, font });
      p.drawText(`Completed: ${new Date(rec.completedAt).toLocaleString()}`, { x: 50, y: 684, size: 12, font });
      let yy = 660;
      p.drawText("Objectives:", { x: 50, y: yy, size: 12, font }); yy -= 14;
      rec.learningObjectives.forEach((obj) => { p.drawText(`- ${obj}`.slice(0, 90), { x: 60, y: yy, size: 11, font }); yy -= 12; });
      if (rec.reflection) { yy -= 6; p.drawText("Reflection:", { x: 50, y: yy, size: 12, font }); yy -= 14; p.drawText(rec.reflection.slice(0, 350), { x: 60, y: yy, size: 11, font }); }
      if (rec.evidenceLinks?.length) { yy -= 6; p.drawText("Evidence:", { x: 50, y: yy, size: 12, font }); yy -= 14; rec.evidenceLinks.forEach((l) => { p.drawText(l.slice(0, 90), { x: 60, y: yy, size: 10, font }); yy -= 12; }); }
      p.drawText("Designed to support independent CPD submissions.", { x: 50, y: 40, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
    });
    const bytes = await pdfDoc.save();
    const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as ArrayBufferLike);
    const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
    const blob = new Blob([buffer], { type: "application/pdf" });
    saveAs(blob, "cpd-evidence-pack.pdf");
  };

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <header className="space-y-2 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD learning record</p>
        <h1 className="text-2xl font-semibold text-slate-900">My CPD transcript</h1>
        <p className="text-sm text-slate-700">Local-only record of courses, templates, and assessments you saved.</p>
        <p className="text-sm font-semibold text-slate-900">Hours accumulated: {hours.toFixed(2)}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportFile("csv")}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportFile("json")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={exportCertificate}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Download certificate (all)
          </button>
          <button
            type="button"
            onClick={exportEvidencePack}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Download evidence pack
          </button>
        </div>
        <p className="text-xs text-slate-600">Designed to support independent CPD submissions.</p>
      </header>

      <section className="space-y-3">
        {records.length === 0 ? (
          <p className="text-sm text-slate-700">No CPD records yet. Save evidence from a template or course.</p>
        ) : (
          <ul className="space-y-3">
            {records.map((rec) => (
              <li key={rec.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{rec.itemId}</p>
                    <p className="text-xs text-slate-600">
                      {rec.activityType} · {new Date(rec.completedAt).toLocaleString()} · {rec.timeMinutes} minutes
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{rec.category || "General"}</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-slate-800">
                  <p className="font-semibold">Objectives</p>
                  <ul className="list-disc pl-5">
                    {rec.learningObjectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>
                {rec.reflection && (
                  <div className="mt-2 text-sm text-slate-800">
                    <p className="font-semibold">Reflection</p>
                    <p className="text-slate-700">{rec.reflection}</p>
                  </div>
                )}
                {rec.evidenceLinks?.length ? (
                  <div className="mt-2 text-sm text-slate-800">
                    <p className="font-semibold">Evidence links</p>
                    <ul className="list-disc pl-5">
                      {rec.evidenceLinks.map((l) => (
                        <li key={l} className="break-all text-slate-700">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
