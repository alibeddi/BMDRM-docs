# BMDRM Documentation Site

This is the documentation website for the BMDRM project.

## Project Structure
- `docs/`: Place your Markdown (`.md`) files here.
- `app/`: Next.js application code.
- `lib/`: Utility functions.

## How to Add Documentation
1. Create a new `.md` file in the `docs` directory.
2. Add the required frontmatter at the top of the file:
   ```markdown
   ---
   title: Your Document Title
   ---
   ```
3. Write your content in Markdown.

The new document will automatically appear in the sidebar.

## Running Locally
```bash
npm install
npm run dev
```

## deployment
Run `npm run build` to build the static site.
