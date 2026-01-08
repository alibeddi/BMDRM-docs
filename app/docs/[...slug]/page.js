import { getAllDocs, getDocData, getFlattenedDocs } from '@/lib/docs';
import ReactMarkdown from 'react-markdown';
import TOC from '@/app/components/TOC';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import CodeRenderer from '@/app/components/CodeRenderer';
import Pagination from '@/app/components/Pagination';

export async function generateStaticParams() {
    const docs = getAllDocs();
    return docs;
}

export default async function DocPage({ params }) {
    const { slug } = await params;
    const docData = getDocData(slug);

    // Pagination Logic
    const allDocs = getFlattenedDocs();
    const currentPath = docData.slug;
    const currentIndex = allDocs.findIndex(doc => doc.path === currentPath);

    const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
    const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

    // Generate Breadcrumb Items
    const breadcrumbItems = slug.map((segment, index) => {
        const relativePath = slug.slice(0, index + 1).join('/');
        const path = `/docs/${relativePath}`;

        // Check if this path corresponds to a valid, generated doc (flattened list)
        // Note: getFlattenedDocs returns items with 'path' relative to 'docs/'
        // e.g. 'getting-started/installation' or 'getting-started' (if index exists)
        const isClickable = allDocs.some(doc => doc.path === relativePath);

        if (index === slug.length - 1) {
            return { label: docData.title, path, clickable: false }; // Current page is not need to be a link
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
                            h1: () => null, // Hide H1s from markdown to avoid duplicates
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
                <TOC headings={docData.headings} />
            </aside>
        </div>
    );
}
