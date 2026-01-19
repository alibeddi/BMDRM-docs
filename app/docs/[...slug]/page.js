import { getDocBySlug, getDocPaths, getDocsTreeNormalized, getFlattenedDocs } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import TOC from '@/app/components/TOC';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import CodeRenderer from '@/app/components/CodeRenderer';
import Pagination from '@/app/components/Pagination';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    // We prefer the dedicated paths endpoint for build performance
    const paths = await getDocPaths();

    // Normalize paths: ensure they are array of segments
    // Assuming API returns an array of path strings relative to docs/ 
    // e.g. ["getting-started/intro", "api/auth"]
    if (Array.isArray(paths)) {
        return paths.map(path => ({
            slug: path.split('/')
        }));
    }

    return [];
}

export default async function DocPage({ params }) {
    const { slug } = await params;
    const docData = await getDocBySlug(slug);

    if (!docData) {
        notFound();
    }

    // Extract headings from markdown content if not provided by API
    if (!docData.headings && docData.content) {
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const matches = [];
        let match;
        while ((match = headingRegex.exec(docData.content)) !== null) {
            const level = match[1].length; // 2 or 3
            const text = match[2];
            // Generate simple ID (must match what ReactMarkdown generates)
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            matches.push({ level, text, id });
        }
        docData.headings = matches;
    }

    // Pagination Logic requires the full tree context
    const tree = await getDocsTreeNormalized();
    const allDocs = getFlattenedDocs(tree);

    // Normalize current path for matching
    const currentPath = Array.isArray(slug) ? slug.join('/') : slug;
    const currentIndex = allDocs.findIndex(doc => doc.path === currentPath);

    const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
    const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

    // Generate Breadcrumb Items
    const breadcrumbItems = slug.map((segment, index) => {
        const relativePath = slug.slice(0, index + 1).join('/');
        const path = `/docs/${relativePath}`;

        const isClickable = allDocs.some(doc => doc.path === relativePath);

        if (index === slug.length - 1) {
            return { label: docData.title, path, clickable: false };
        }

        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        return { label, path, clickable: isClickable };
    });

    return (
        <div className="doc-layout">
            <div className="content-wrapper">
                <article className="prose prose-invert max-w-none doc-content">
                    <Breadcrumbs items={breadcrumbItems} />
                    <h1>{docData.title}</h1>
                    <ReactMarkdown
                        components={{
                            code: CodeRenderer,
                            h1: () => null,
                            h2: ({ node, children, ...props }) => {
                                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
                                return <h2 id={id} {...props}>{children}</h2>
                            },
                            h3: ({ node, children, ...props }) => {
                                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
                                return <h3 id={id} {...props}>{children}</h3>
                            }
                        }}
                    >
                        {docData.content}
                    </ReactMarkdown>

                    <Pagination prev={prev} next={next} />
                </article>
            </div>

            <aside className="toc-sidebar">
                <TOC headings={docData.headings || []} />
            </aside>
        </div>
    );
}
