'use client';

import Link from 'next/link';

export default function Pagination({ prev, next }) {
    if (!prev && !next) return null;

    return (
        <div className="doc-pagination">
            {prev ? (
                <Link href={`/docs/${prev.path}`} className="pagination-link prev">
                    <span className="pagination-label">Previous</span>
                    <div className="pagination-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon"><path d="m15 18-6-6 6-6" /></svg>
                        {prev.title}
                    </div>
                </Link>
            ) : <div />}

            {next ? (
                <Link href={`/docs/${next.path}`} className="pagination-link next">
                    <span className="pagination-label">Next</span>
                    <div className="pagination-title">
                        {next.title}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                </Link>
            ) : <div />}
        </div>
    );
}
