# my-webapp

Premium, security-first learning hub for architecture, cybersecurity, and AI. Built with Next.js, MDX-driven
courses, and interactive browser-only labs (RSA keygen, Python WASM sandbox, entropy checks).

## Run it locally

```bash
npm install
npm run dev
```

## Add or edit courses

- Drop new lessons into `content/courses/<course-slug>/<lesson>.mdx`.
- Front matter supports `title`, `description`, `order`, `tags`, `level`, and `duration`.
- MDX can embed React components such as `<RsaPlayground />`, `<PythonPlayground />`, and `<Callout />`.
