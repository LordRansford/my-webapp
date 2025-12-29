# British English Style Guide

This guide ensures all content on Ransford's Notes uses British English spelling, punctuation, and style conventions.

## Core Principles

1. **British Spelling**: Always use British spellings, not American
2. **No Em-dashes**: Avoid em-dashes (—). Use commas or full stops instead
3. **Natural Language**: Avoid "generated feel" language patterns
4. **Plain Language**: Short sentences, clear meaning, no jargon without definitions

## Spelling Rules

### Common Conversions

| American | British | Notes |
|----------|---------|-------|
| organize | organise | All -ize → -ise |
| color | colour | All -or → -our |
| center | centre | All -er → -re (when appropriate) |
| analyze | analyse | All -yze → -yse |
| optimize | optimise | All -ize → -ise |
| behavior | behaviour | All -or → -our |
| defense | defence | All -ense → -ence |
| recognize | recognise | All -ize → -ise |
| realize | realise | All -ize → -ise |
| customize | customise | All -ize → -ise |
| finalize | finalise | All -ize → -ise |
| prioritize | prioritise | All -ize → -ise |
| standardize | standardise | All -ize → -ise |

### Special Cases

- **license (verb)** → **licence (verb)**
- **license (noun)** → **licence (noun)** (British) or **license (noun)** (also acceptable in British English)
- **practice (noun)** → **practice** (correct in British English)
- **practise (verb)** → **practise** (correct in British English)

## Punctuation

### Em-dashes

**❌ Avoid:**
- "This is important—you should know this."
- "The course covers AI—from basics to advanced."

**✅ Use instead:**
- "This is important. You should know this."
- "This is important, and you should know this."
- "The course covers AI, from basics to advanced."

### Quotation Marks

**British Style:**
- Use single quotes for quotations: 'This is a quote.'
- Use double quotes for quotes within quotes: "He said 'This is important.'"

### Commas

- Use the Oxford comma when it clarifies meaning
- Use commas to separate clauses, not em-dashes

## Style Guidelines

### Avoid "Generated Feel" Language

**❌ Avoid:**
- "In this article, we will explore..."
- "Let's dive into..."
- "Welcome to..."
- "In conclusion..."
- "It's worth noting that..."
- "It's important to note that..."

**✅ Use instead:**
- "This section covers..."
- "We explore..."
- Direct statements: "AI is..."
- "To summarise..."
- "Note that..." or just state the fact directly
- State the important point directly

### Plain Language Principles

1. **Short Sentences**: Aim for 15-20 words per sentence
2. **Active Voice**: Prefer active over passive
3. **Clear Definitions**: Define jargon the first time it appears
4. **Direct Statements**: Say what you mean directly

### Examples

**❌ Generated Feel:**
"In this section, we will explore the fundamentals of AI. It's worth noting that AI has become increasingly important in recent years."

**✅ Natural British English:**
"This section covers AI fundamentals. AI has become increasingly important in recent years."

## Verification

### Automated Checks

Run the verification script:
```bash
node scripts/verify-british-english.mjs
```

To auto-fix common issues (use with caution):
```bash
node scripts/verify-british-english.mjs --fix
```

### Manual Review Checklist

Before publishing content, verify:
- [ ] All -ize → -ise conversions
- [ ] All -or → -our conversions
- [ ] All -er → -re conversions (where appropriate)
- [ ] No em-dashes (—)
- [ ] No "generated feel" language patterns
- [ ] Punctuation style consistent (British conventions)
- [ ] Quotation marks use British style
- [ ] Sentences are clear and direct

## Resources

- [Oxford English Dictionary](https://www.oed.com/) - Authoritative British English reference
- [Cambridge Dictionary](https://dictionary.cambridge.org/) - British English dictionary
- [Plain English Campaign](https://www.plainenglish.co.uk/) - Plain language guidelines

---

**Last Updated**: [Current Date]  
**Maintained By**: Development Team

