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

    // Helper to check if a path is active (robust against trailing slashes/basePath)
    // defined here to use current pathname
    const checkActive = (path) => {
        if (!path) return false;
        const normalize = (p) => p?.replace(/\/+$/, '') || '';
        const currentPath = normalize(pathname);
        const target = normalize(`/docs/${path}`);
        return currentPath === target || currentPath.endsWith(target);
    };

    const isActive = item.type === 'file' && checkActive(item.path);
    const isFolderActive = item.type === 'folder' && checkActive(item.path);

    // Folders state
    const [isOpen, setIsOpen] = useState(false);

    // Auto-expand if child is active OR if the folder itself is the active page
    useEffect(() => {
        if (item.type === 'folder') {
            const matchesPath = isFolderActive;

            const hasActiveChild = (children) => {
                return children.some(child => {
                    if (child.type === 'file') return checkActive(child.path);
                    if (child.type === 'folder') {
                        if (child.path && checkActive(child.path)) return true;
                        return hasActiveChild(child.children);
                    }
                    return false;
                });
            };

            if (matchesPath || hasActiveChild(item.children)) {
                setIsOpen(true);
            }
        }
    }, [pathname, item, isFolderActive]); // checkActive dependency implied by re-render

    if (item.type === 'folder') {
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
                            onClick={() => setIsOpen(true)} // Keep open when navigating to index
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
