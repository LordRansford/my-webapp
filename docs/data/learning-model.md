# Learning and CPD data model (canonical)

This document defines the canonical learning model for RansfordsNotes.
It is the source of truth for identifiers, relationships, completion semantics, and CPD credit structure.

## Entities

### Course
- **id**: stable string (example: `cybersecurity`, `ai`, `data`, `digitalisation`, `software-architecture`)
- **relationships**: contains Modules
- **completion**: derived from Module and Section completion
- **immutability**: the identifier is immutable; course metadata can change with versioning
- **derived vs stored**: totals are derived; versioned descriptors are stored

### Module
- **id**: stable string scoped to course (example: `beginner`, `intermediate`, `advanced`, `summary`)
- **relationships**: contains Sections and may reference Tools and Quizzes
- **completion**: derived from Section completion within the module
- **immutability**: identifier is immutable; content can change with versioning

### Section
- **id**: stable string scoped to module
- **relationships**: may include Tools and Quizzes
- **completion**: boolean completion event, tracked per user
- **immutability**: completion records are append-only; corrections create new evidence records

### Tool
- **id**: stable string
- **relationships**: belongs to a Section and optionally a Module
- **completion**: a ToolRun record can exist without completion; completion rules are tool specific
- **immutability**: toolId is immutable; tool versions can change over time

### Quiz
- **id**: stable string
- **relationships**: belongs to a Section
- **completion**: a completed attempt meeting the rules for the quiz
- **immutability**: attempt records are append-only

### Attempt
- **id**: stable unique id
- **relationships**: belongs to a user and references a Tool or Quiz
- **completion**: attempt can be completed or abandoned
- **immutability**: append-only, never overwritten

### Completion
- **id**: stable unique id (or derived key)
- **relationships**: references (Course, Module, Section) and user
- **completion**: a Section completion means the user completed the learning unit
- **immutability**: append-only; changes create a correction record

### CPD credit unit
- **id**: stable identifier for a creditable activity
- **relationships**: references the learning unit and the evidence records
- **completion**: credits are granted by deterministic rules, then rolled up
- **immutability**: credits granted are derived from evidence and rules version

### Evidence record
- **id**: stable unique id
- **relationships**: references a user and an activity (reading, tool, quiz, completion)
- **fields**: timestamp, activity type, reference ids, version ids, integrity hash
- **immutability**: append-only; corrections create additional evidence records

## What constitutes completion (current posture)
- **Sections**: completion is explicitly toggled and stored per user.
- **Tools**: a run can grant a small CPD delta, but must remain deterministic and capped by plan.
- **Quizzes**: completion is derived from answering, and a CPD delta may be recorded.

## Immutability rules
- Evidence and activity history are append-only.
- Corrections are represented as new records, not in-place mutation.
- Rollups are derived from underlying records and rule versions.

## Derived vs stored
- Stored:
  - evidence records and activity entries
  - section completion flags and per-section minute totals
  - rule versions for audit
- Derived:
  - totals per course, per period summaries
  - completion percent
  - explanations for why credits were granted


