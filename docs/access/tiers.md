# Access tiers (internal and public reference)

This project uses capability-based access tiers.
Tier checks must be enforced server-side. The UI should reflect capabilities but must not be relied on for security.

## Tiers

### Visitor

- Can view all written course content, diagrams, and course pages
- Can view quizzes (read-only)
- Cannot track progress or CPD hours
- Cannot execute tools or dashboards

### Registered learner

- Can track progress and CPD hours
- Can save quiz completion signals
- Can run basic tools and dashboards

### Supporter

- Everything in Registered learner
- Advanced dashboards unlocked
- Higher tool usage limits
- Supporter badge

### Professional

- Everything in Supporter
- Template downloads
- Exportable reports
- CPD evidence export
- Early access to new tools

## Capability map (summary)

- `view_content`: Visitor and above
- `track_progress`: Registered learner and above
- `run_tools_basic`: Registered learner and above
- `run_dashboards_basic`: Registered learner and above
- `run_dashboards_advanced`: Supporter and above
- `templates_download`: Professional
- `reports_export`: Professional
- `cpd_evidence_export`: Professional


