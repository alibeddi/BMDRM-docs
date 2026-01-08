'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Icons
const ChevronRight = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

const ChevronDown = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

const SidebarItem = ({ item, level = 0 }) => {
    const pathname = usePathname();
    const isActive = item.type === 'file' && `/docs/${item.path}` === pathname;

    // Folders state
    const [isOpen, setIsOpen] = useState(false);

    // Auto-expand if child is active
    useEffect(() => {
        if (item.type === 'folder') {
            const hasActiveChild = (children) => {
                return children.some(child => {
                    if (child.type === 'file') return `/docs/${child.path}` === pathname;
                    if (child.type === 'folder') return hasActiveChild(child.children);
                    return false;
                });
            };
            if (hasActiveChild(item.children)) {
                setIsOpen(true);
            }
        }
    }, [pathname, item]);

    if (item.type === 'folder') {
        const isFolderActive = item.path && `/docs/${item.path}` === pathname;

        return (
            <div className="nav-group" style={{ marginBottom: level === 0 ? '24px' : '4px' }}>
                <div className="nav-folder-header">
                    {/* 1. Toggle Button (Always present for folders) */}
                    <button
                        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                        className="nav-folder-toggle"
                        style={{ paddingLeft: level === 0 ? 0 : '12px' }}
                    >
                        <span className="icon-wrap">{isOpen ? <ChevronDown /> : <ChevronRight />}</span>
                    </button>

                    {/* 2. Folder Title: Either a Link (if index exists) or text (if pure grouping) */}
                    {item.path ? (
                        <Link
                            href={`/docs/${item.path}`}
                            className={`folder-title-link ${isFolderActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(true)} // Optional: open on click too? User said clicking name opens "it" (the page)
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <span
                            className="folder-title-text"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {item.title}
                        </span>
                    )}
                </div>

                {isOpen && (
                    <div className="nav-folder-children">
                        {item.children.map(child => (
                            <SidebarItem key={child.name} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // File
    return (
        <Link
            href={`/docs/${item.path}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{ paddingLeft: level === 0 ? '12px' : '24px' }}
        >
            {item.title}
        </Link>
    );
};

export default function Sidebar({ tree }) {
    return (
        <nav className="docs-nav">
            {tree.map(item => (
                <SidebarItem key={item.name} item={item} />
            ))}
        </nav>
    );
}
