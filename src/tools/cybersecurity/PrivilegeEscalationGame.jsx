"use client";

import { useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

const roles = [
  { id: "viewer", title: "Viewer", perms: ["read"] },
  { id: "editor", title: "Editor", perms: ["read", "write"] },
  { id: "admin", title: "Admin", perms: ["read", "write", "delete"] },
];

export default function PrivilegeEscalationGame({ storageKey }) {
  const [assign, setAssign] = useState({ finance: "admin", marketing: "editor", intern: "viewer" });
  const [checked, setChecked] = useState(false);

  const risky = assign.intern === "admin" || assign.marketing === "admin";

  const check = () => {
    setChecked(true);
    log(storageKey, { type: "privilege_assignment", risky });
  };

  const setRole = (user, role) => setAssign((p) => ({ ...p, [user]: role }));

  const roleLabel = (id) => roles.find((r) => r.id === id)?.title || id;

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Assign roles</div>
        <div className="rn-tool-sub">Assign least privilege. Then see how small mistakes become big breaches.</div>
      </div>

      <div className="rn-grid rn-grid-3">
        {["finance", "marketing", "intern"].map((user) => (
          <div key={user} className="rn-card">
            <div className="rn-card-title">{user === "intern" ? "Intern" : user.charAt(0).toUpperCase() + user.slice(1)}</div>
            <div className="rn-card-body">Current: {roleLabel(assign[user])}</div>
            <div className="rn-actions rn-mt">
              {roles.map((r) => (
                <button key={r.id} className={`rn-btn ${assign[user] === r.id ? "rn-btn-primary" : ""}`} onClick={() => setRole(user, r.id)}>
                  {r.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn rn-btn-primary" onClick={check}>
          Evaluate
        </button>
      </div>

      {checked && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">{risky ? "Privilege escalation likely" : "Permissions look sane"}</div>
          <div className="rn-card-body">
            {risky
              ? "High privilege assigned broadly increases blast radius. An intern with admin rights is a breach waiting to happen."
              : "Tighter scopes reduce blast radius. Keep reviewing changes, especially for temporary accounts."}
          </div>
        </div>
      )}
    </div>
  );
}
