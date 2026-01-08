'use client';

import Link from 'next/link';
import Search from './Search';
import ThemeToggle from './ThemeToggle';

export default function Topbar({ docs }) {
    return (
        <header className="topbar">
            <div className="topbar-inner">
                <Link href="/" className="logo">
                    <span className="logo-text">BMDRM</span>
                    <span className="logo-badge">Docs</span>
                </Link>

                <div className="topbar-actions">
                    <Search docs={docs} />
                    <div className="divider"></div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
