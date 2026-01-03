import { NextResponse } from "next/server";
import { listAccreditationMappings } from "@/lib/accreditation/mapping";
import { getAuditLog } from "@/lib/cpd/audit-log";
import { getCourseLevelMeta } from "@/lib/cpd/courseEvidence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auditLog = await getAuditLog();
    const mappings = listAccreditationMappings();

    const packManifest = {
      generated: new Date().toISOString(),
      version: "1.0.0",
      courses: mappings.map((m) => ({
        courseId: m.courseId,
        cpdHours: m.cpdHours,
        learningOutcomes: m.learningOutcomes.length,
        applicableBodies: m.applicableBodies,
      })),
      evidence: {
        accreditationMapping: true,
        auditLog: true,
        courseSyllabi: true,
        assessmentMethods: true,
        qualityAssurance: true,
      },
    };

    const qualityStatement = `Quality Assurance Statement
Generated: ${new Date().toISOString()}

Course Design Principles:
- Clear learning outcomes aligned with professional competency domains
- Progressive complexity from foundations to advanced
- Practical application through hands-on tools and templates
- Evidence-based content grounded in established standards
- Accessibility following WCAG guidelines

Continuous Improvement:
- Version control for all materials
- Learner feedback collection and review
- Regular content review cycles
- Assessment validation processes

Versioning:
- All materials are versioned
- Changes tracked in audit log
- Full traceability maintained

Content Ownership:
- All content authored by Ransford Amponsah
- References to established frameworks appropriately cited
- Clear usage terms for templates and tools
`;

    const courseSummaries = mappings.map((mapping) => {
      return `Course: ${mapping.courseId}
CPD Hours: ${mapping.cpdHours}
Version: ${mapping.version}

Learning Outcomes:
${mapping.learningOutcomes.map((lo) => `  - ${lo.description}`).join("\n")}

Applicable Bodies:
${mapping.applicableBodies.map((b) => `  - ${b}`).join("\n")}

---
`;
    }).join("\n");

    const pack = {
      manifest: packManifest,
      accreditationMap: mappings,
      courseMetadata: {
        ai: {
          foundations: getCourseLevelMeta("ai", "foundations"),
          intermediate: getCourseLevelMeta("ai", "intermediate"),
          advanced: getCourseLevelMeta("ai", "advanced"),
          summary: getCourseLevelMeta("ai", "summary"),
        },
        cybersecurity: {
          foundations: getCourseLevelMeta("cybersecurity", "foundations"),
          applied: getCourseLevelMeta("cybersecurity", "applied"),
          practice: getCourseLevelMeta("cybersecurity", "practice"),
        },
        "network-models": {
          foundations: getCourseLevelMeta("network-models", "foundations"),
          applied: getCourseLevelMeta("network-models", "applied"),
          practice: getCourseLevelMeta("network-models", "practice"),
          summary: getCourseLevelMeta("network-models", "summary"),
        },
        "software-architecture": {
          foundations: getCourseLevelMeta("software-architecture", "foundations"),
          intermediate: getCourseLevelMeta("software-architecture", "intermediate"),
          advanced: getCourseLevelMeta("software-architecture", "advanced"),
          summary: getCourseLevelMeta("software-architecture", "summary"),
        },
        data: {
          foundations: getCourseLevelMeta("data", "foundations"),
          intermediate: getCourseLevelMeta("data", "intermediate"),
          advanced: getCourseLevelMeta("data", "advanced"),
          summary: getCourseLevelMeta("data", "summary"),
        },
        digitalisation: {
          foundations: getCourseLevelMeta("digitalisation", "foundations"),
          intermediate: getCourseLevelMeta("digitalisation", "intermediate"),
          advanced: getCourseLevelMeta("digitalisation", "advanced"),
          summary: getCourseLevelMeta("digitalisation", "summary"),
        },
      },
      auditLogSample: auditLog.slice(0, 100),
      qualityStatement,
      courseSummaries,
    };

    return NextResponse.json(pack, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="accreditation-pack-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error generating accreditation pack:", error);
    return NextResponse.json({ error: "Failed to generate pack" }, { status: 500 });
  }
}
