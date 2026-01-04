# Admin support playbook

## Purpose
This document is written for non technical support staff.
It gives a consistent way to diagnose account, payment, credits, assessment, and certificate issues.

## Golden rules
1. Always ask for the learner email address
2. Always record a reason for any admin action
3. Prefer credits grants over manual workarounds when a learner is blocked
4. Never ask for passwords because we do not store them
5. Never request secrets or tokens in support tickets

## Where to look
1. Admin user page
   1. Open `/admin/users`
   2. Search for the learner email
   3. Open the user
   4. Load Support snapshot
2. Certificates
   1. Learner view is `/account/certificates`
   2. Verification page is `/verify/certificate/<hash>`
3. Assessments
   1. Learner pages are under `/cybersecurity/assessment/<level>`
   2. Admin answer keys can be downloaded from `/admin/assessments`

## Common scenarios and what to do

## Scenario 1
Learner cannot sign in

1. Confirm they are using the same email address that was used before
2. Ask them to use Google sign in if they used Google before
3. If email sign in is used confirm the email server is configured
4. Check the user exists in `/admin/users`
5. If user exists but accountStatus is suspended set it back to active with a reason

## Scenario 2
Learner says they paid but cannot do an assessment

1. Open the user Support snapshot
2. Check Credits balance
3. If balance is zero grant credits with a reason
4. Check Credit lots to confirm the source and date
5. Check Purchases for the relevant session and status

## Scenario 3
Learner cannot issue a certificate after passing

1. Open Support snapshot
2. Check Recent assessment attempts and confirm a pass exists for the correct course version
3. Check Certificates list
4. If no certificate exists ensure the learner has enough credits for certificate issuance in other courses
5. For Cybersecurity certificates are zero credits so failures are likely eligibility or data issues

## Scenario 4
Learner name mismatch blocks starting an assessment

1. This happens when the certificate name is locked and a different name is entered
2. Open Support snapshot and check Certificate name
3. Ask the learner to use the exact same name
4. If the locked name is wrong create a support ticket for the site owner to review

## Scenario 5
Learner says the retake has too many repeated questions

1. Retakes are designed to be mixed
2. A portion of missed questions is intentionally repeated to support learning and reduce randomness
3. The rest is drawn from a 150 question bank and avoids the last attempt where possible
4. If the bank is smaller than 150 the system should block attempts until the bank is expanded

## Scenario 6
Learner claims they passed but the system says not eligible

1. Confirm which level they passed
2. Confirm the course version
3. Confirm they are signed in to the same account
4. Check the latest attempt score and passed flag in Support snapshot
5. If needed ask the site owner to review database records

## Escalation checklist
When escalating to the site owner include

1. User id
2. Email
3. What the learner tried to do
4. Exact error message if available
5. Timestamp
6. Course and level
7. Assessment attempt id if present
8. Stripe session id if present

