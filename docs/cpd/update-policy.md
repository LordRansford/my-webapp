# CPD update and quality assurance policy (internal)

This document describes how the platform is reviewed and updated, for assessor and internal governance purposes.

## Review frequency

- Quarterly review of CPD course metadata (hours, objectives, structure).
- Monthly review of tools and dashboards that produce evidence signals.
- Ad hoc review when standards, guidance, or common practices materially change.

## Change triggers

Updates should be considered when:
- a course structure changes (levels, routes, navigation)
- learning objectives change
- hour estimates need adjustment
- a tool output changes in a way that affects evidence interpretation
- a security or privacy control changes
- user feedback identifies ambiguity, inaccuracy, or broken evidence flows

## Quality assurance process

- Changes are made via pull requests and reviewed before release.
- Lint and build checks must pass before deployment.
- CPD-specific quality checks should remain deterministic and non-flaky.
- Where feasible, evidence-related data shapes should be tested for stability.

## Versioning approach

- Source content and tools are version-controlled in the repository.
- Evidence-related output formats should remain backward compatible when possible.
- If a breaking change is required, document the reason and migration notes.

## User feedback handling

- Feedback that impacts correctness, safety, or clarity is prioritised.
- Requests for accreditation claims or logos are not accepted without verified approval.

# CPD update policy (internal)

This policy describes how the platform is maintained so assessors can trust stability and traceability.

## Review frequency

- Light review: monthly
- Full review: quarterly
- Security and dependency review: ongoing through CI and dependency updates

## Update triggers

- Bug reports that affect correctness of tools, CPD tracking, or evidence generation
- Security updates or dependency advisories
- Accessibility feedback that affects usability
- Content clarity issues that cause repeated misunderstandings

## User feedback handling

- Feedback is captured via contact channels and triaged for impact.
- Changes that affect CPD estimates or objectives require a review note and a clear reason.

## Versioning approach

- Source control is the primary record of changes.
- Course metadata (hours and objectives) lives in versioned content files.
- Evidence and audit-related data structures are documented and changes are traceable.

## Backwards compatibility posture

- Existing course identifiers should remain stable.
- When a structural change is unavoidable, it should be recorded as an audit event.
- Changes that would affect historic CPD interpretation should be documented clearly.


