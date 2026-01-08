'use client';

import { Command } from 'cmdk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function Search({ docs }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Toggle with Cmd+K
    useEffect(() => {
        setMounted(true);
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="search-trigger"
            >
                <span className="search-icon">🔍</span>
                <span className="search-text">Search documentation...</span>
                <kbd className="search-kbd">⌘K</kbd>
            </button>

            {open && mounted && createPortal(
                <div className="search-dialog-overlay" onClick={() => setOpen(false)}>
                    <div className="search-dialog-content" onClick={(e) => e.stopPropagation()}>
                        <Command label="Global Search" className="search-command">
                            <div className="search-input-wrapper">
                                <Command.Input
                                    placeholder="Search docs..."
                                    className="search-input"
                                    autoFocus
                                />
                            </div>
                            <Command.List className="search-list">
                                <Command.Empty className="search-empty">No results found.</Command.Empty>

                                {docs.map((doc) => (
                                    <Command.Item
                                        key={doc.path}
                                        value={`${doc.title} ${doc.name}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(`/docs/${doc.path}`));
                                        }}
                                        className="search-item"
                                    >
                                        <div className="search-item-icon">📄</div>
                                        <div className="search-item-content">
                                            <span className="search-item-title">{doc.title}</span>
                                            <span className="search-item-path">{doc.path}</span>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.List>
                        </Command>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
