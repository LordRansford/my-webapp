# Authoring guide

## How I publish new notes
1. Log in to WordPress at `https://ransfordsnotes.com/wp-admin`.
2. Create or edit a post. Use clear titles and add a short summary paragraph near the top.
3. Add images directly in WordPress. They are allowed to render on the site.
4. Publish. The Next.js site refreshes automatically within about five minutes.

## Writing checklist
- Keep one idea per post; lead with the problem, decision, and outcome.
- Add a brief “How to reuse this” section with steps or code snippets.
- Use headings (`H2`, `H3`) to keep sections scannable.
- Prefer code blocks for any commands or scripts; avoid inline screenshots of code.
- Add links to `/tools` where relevant so readers can experiment immediately.

## How search works
- The Notes page searches over titles and excerpts. Write descriptive titles and meaningful excerpts in WordPress to make discovery easier.

## When to update
- If you change a post in WordPress, the site will refresh the cached page on the next visitor within five minutes. No code changes are required.

## What not to commit
- Do not commit `.env.local`, `node_modules`, or `.next`. The `.gitignore` already covers these. Keep secrets in Vercel environment variables only.
