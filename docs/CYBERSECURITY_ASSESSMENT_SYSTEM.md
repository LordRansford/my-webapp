# Cybersecurity assessment system

## Purpose
This system adds certification grade assessments for the Cybersecurity course.
It is designed to be reusable as the template for the other courses later.

## What is included
1. Three assessments
2. Timed sessions
3. Attempt tracking
4. Pass threshold
5. Certificate name lock
6. Certificate issuance on pass
7. Admin question editor with publish workflow
8. Basic item analysis for question tuning

## Routes
1. Assessment pages
   1. `/cybersecurity/assessment/foundations`
   2. `/cybersecurity/assessment/applied`
   3. `/cybersecurity/assessment/practice`
2. API routes
   1. `POST /api/assessments/start`
   2. `POST /api/assessments/submit`
   3. `GET /api/assessments/status`
3. Admin routes
   1. `/admin/assessments`
4. Admin API routes
   1. `GET /api/admin/assessments/questions`
   2. `POST /api/admin/assessments/questions`
   3. `POST /api/admin/assessments/questions/[id]`
   4. `GET /api/admin/assessments/analysis`

## Rules
1. Time limit is 75 minutes
2. Question count is 50
3. Pass mark is 80 percent
4. Retakes are allowed and attempts are tracked
5. Candidate name is locked for certificates

## Data model
1. `Assessment`
2. `Question`
3. `AssessmentSession`
4. `AssessmentAttempt`
5. `LearnerProfile`

## Seeding questions
Run the seed script in an environment that has a database connection.

1. Set `DATABASE_URL`
2. Run `node scripts/seed-cyber-assessments.mjs`

## Publishing workflow
Questions are selected for exams only when both tags exist.

1. `v:2025.01` or the active course version
2. `published`

## Certificate cost model for Cybersecurity
Certificates for the Cybersecurity course are set to zero credits.
The assessment attempt consumes credits instead.

