'use client';

import { useState, useEffect } from 'react';

export default function TOC({ headings }) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            // 1. Standard Detection
            // Find the last heading closer to the top of the viewport
            let currentId = '';
            // Use a generous reading offset (e.g. 150px from top) to catch headers as they enter the reading zone
            const offset = 150;

            for (const heading of headings) {
                const element = document.getElementById(heading.id);
                if (element) {
                    const rect = element.getBoundingClientRect();

                    if (rect.top <= offset) {
                        currentId = heading.id;
                    } else {
                        break;
                    }
                }
            }

            if (currentId) {
                setActiveId(currentId);
            }
        };

        // Throttle slightly for performance if needed, but modern browsers handle this well with passive listeners
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    if (!headings || headings.length === 0) return null;

    // Determine the active scope (Parent H2 + Child H3s)
    // 1. Identify active index
    const activeIndex = headings.findIndex(h => h.id === activeId);

    // 2. Determine the "Active Block"
    // If active is H2, it starts there. If active is H3, search backwards for H2.
    let rangeStart = -1;
    let rangeEnd = -1;

    if (activeIndex !== -1) {
        // Search backwards for the parent H2 (or self if H2)
        for (let i = activeIndex; i >= 0; i--) {
            if (headings[i].level === 2) {
                rangeStart = i;
                break;
            }
        }
        // If we found a start (H2), search forwards for the end of its children (until next H2)
        if (rangeStart !== -1) {
            for (let i = rangeStart + 1; i < headings.length; i++) {
                if (headings[i].level === 2) {
                    rangeEnd = i - 1;
                    break;
                }
                rangeEnd = i; // Extend range to this H3
            }
            if (rangeEnd === -1) rangeEnd = headings.length - 1; // Goes to end of list
        }
    }

    return (
        <div className="toc-sticky">
            <h4>On This Page</h4>
            <ul>
                {headings.map((heading, index) => {
                    const isActive = activeId === heading.id;
                    const isInActiveSection = index >= rangeStart && index <= rangeEnd;

                    return (
                        <li key={index} className={`toc-item toc-level-${heading.level}`}>
                            <a
                                href={`#${heading.id}`}
                                className={`${isActive ? 'active' : ''} ${isInActiveSection ? 'in-active-section' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                    setActiveId(heading.id);
                                    window.history.pushState(null, '', `#${heading.id}`);
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
