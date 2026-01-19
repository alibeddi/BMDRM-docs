'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSidebar } from '@/app/providers';

// Icons
const ChevronRight = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

const ChevronDown = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

const SidebarItem = ({ item, level = 0 }) => {
    const pathname = usePathname();
    const { openFolders, toggleFolder } = useSidebar();

    // Helper to check if a path is active (robust against trailing slashes/basePath)
    const checkActive = (path) => {
        if (!path) return false;
        const normalize = (p) => p?.replace(/\/+$/, '') || '';
        const currentPath = normalize(pathname);
        const target = normalize(`/docs/${path}`);
        return currentPath === target;
    };

    const isActive = item.type === 'file' && checkActive(item.path);
    const isFolderActive = item.type === 'folder' && checkActive(item.path);

    // Unique ID for folder state management - Prefer ID, fallback to path or name
    const folderId = item.id || item.path || item.name;
    const isOpen = openFolders[folderId] || false;

    // Track previous pathname
    const prevPathRef = useRef(null);

    // Auto-expand logic (only on navigation)
    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            prevPathRef.current = pathname;

            if (item.type === 'folder') {
                if (isFolderActive && !isOpen) {
                    toggleFolder(folderId, true);
                    return;
                }

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

                if (hasActiveChild(item.children)) {
                    toggleFolder(folderId, true);
                }
            }
        }
    }, [pathname, item, isFolderActive, folderId, isOpen, toggleFolder]);

    if (item.type === 'folder') {
        return (
            <div className="nav-group" style={{ marginBottom: level === 0 ? '24px' : '4px' }}>
                <div className="nav-folder-header">
                    {/* 1. Toggle Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFolder(folderId);
                        }}
                        className="nav-folder-toggle"
                        style={{ paddingLeft: level === 0 ? 0 : '12px' }}
                    >
                        <span className="icon-wrap">{isOpen ? <ChevronDown /> : <ChevronRight />}</span>
                    </button>

                    {/* 2. Folder Title */}
                    {item.isClickable ? (
                        <Link
                            href={`/docs/${item.path}`}
                            className={`folder-title-link ${isFolderActive ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(folderId, true);
                            }}
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <span
                            className="folder-title-text"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFolder(folderId);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.title}
                        </span>
                    )}
                </div>

                {isOpen && (
                    <div className="nav-folder-children">
                        {item.children.map(child => (
                            <SidebarItem key={child.id || child.name} item={child} level={level + 1} />
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
            onClick={(e) => e.stopPropagation()}
        >
            {item.title}
        </Link>
    );
};

export default function Sidebar({ tree }) {
    return (
        <nav className="docs-nav">
            {tree.map(item => (
                <SidebarItem key={item.id || item.name} item={item} />
            ))}
        </nav>
    );
}
