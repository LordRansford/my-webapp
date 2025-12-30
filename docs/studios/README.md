# Unified Studios Documentation

## Overview

The Unified Studios platform provides learning and production environments for software development, cybersecurity, data engineering, and architecture diagramming. Each studio follows a consistent pattern: Learn → Build → Deploy.

## Architecture

### Studio Structure

Each studio has two modes:

1. **Learning Studio** (`/studio-studios`): Safe, browser-only educational environment
2. **Live Studio** (`/studio-studio`): Production-ready tools for real-world work

### Studios Hub

The central hub at `/studios/hub` provides:
- Overview of all studios
- Progress tracking across studios
- Quick navigation to learning/live modes
- Role-based recommendations

## Studios

### Dev Studio

**Learning**: `/dev-studios`
- Requirements and domain modeling
- Architecture and system design
- Backend and API design
- Frontend and integration
- Security and reliability
- Deployment and operations

**Live**: `/dev-studio`
- Project Builder
- API Designer
- Schema Designer
- CI/CD Builder
- Deployment Wizard
- Security Scanner
- Performance Profiler
- Cost Calculator

### Cyber Studio

**Learning**: `/cyber-studios`
- Threat landscape
- Risk management fundamentals
- Security architecture
- Defensive controls
- Identity and access
- Application and data security

**Live**: `/cyber-studio`
- Threat Model Generator
- Risk Register Builder
- Compliance Auditor
- Incident Response Playbook Builder
- Security Architecture Designer
- Vulnerability Scanner
- Security Metrics Dashboard

### Data Studio

**Learning**: `/data-studios`
- Data strategy and purpose
- Data architecture
- Data governance and management
- Data quality and assurance
- Analytics and insight

**Live**: `/data-studio`
- Pipeline Designer
- Quality Monitor
- Catalog Builder
- Dashboard Builder
- Privacy Impact Assessor
- Lineage Tracker
- Schema Designer
- Governance Framework

### Architecture Diagram Studio

**Learning**: `/studios/architecture-diagram-studio/learn`
- Diagram pattern library
- Interactive tutorials
- Best practices guide
- Common mistakes

**Live**: `/studios/architecture-diagram-studio`
- Multi-format support (C4, UML, Archimate, Mermaid)
- Real-time collaboration
- Version control
- Validation engine
- Export to code

## Components

### Shared Components

- `StudioNavigation`: Consistent navigation across studios
- `ProgressTracker`: Cross-studio progress tracking
- `CreditConsent`: Compute credit consent UI
- `ErrorBoundaryWrapper`: Consistent error handling
- `LoadingSpinner`: Unified loading states

### Studio-Specific Components

Located in `src/components/{studio-type}-studio/`

## Credit System

### Pricing

- **Starter**: $5 for 10,000 credits (100 seconds)
- **Professional**: $20 for 50,000 credits (500 seconds)
- **Enterprise**: $100 for 300,000 credits (3000 seconds)

### Credit Usage

- Simple operations: 1-10 credits
- Medium complexity: 10-100 credits
- Complex operations: 100-1000 credits

## Audience Profiles

### Enterprise
- Advanced features enabled
- Team collaboration
- Export capabilities
- Compliance tools
- Higher credit limits

### Professional
- Full feature access
- Standard credit limits
- Export capabilities
- No team features

### Student
- Learning-focused features
- Reduced credit limits
- Educational discounts
- Progress tracking

### Child
- Simplified UI
- Pre-approved templates only
- No real credentials
- Visual learning aids
- Parental controls

## Examples and Templates

### Dev Studio
- 15+ project templates (E-commerce, SaaS, API-first, Mobile, IoT, etc.)

### Cyber Studio
- 10+ security scenarios (Threat modeling, Risk assessment, Compliance, etc.)

### Data Studio
- 10+ data projects (ETL pipelines, Analytics, Quality monitoring, etc.)

### Architecture Diagram Studio
- 50+ diagram templates (C4, UML, Deployment, Network, etc.)

## Getting Started

1. Visit `/studios/hub` to see all studios
2. Select your role (Enterprise, Professional, Student, Child)
3. Choose a studio to explore
4. Start with the learning studio to understand concepts
5. Move to the live studio to build real projects

## API Reference

See individual studio documentation:
- `/docs/studios/dev-studio.md`
- `/docs/studios/cyber-studio.md`
- `/docs/studios/data-studio.md`
- `/docs/studios/architecture-studio.md`


