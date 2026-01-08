'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeRenderer({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';

    if (!inline && match) {
        return (
            <div className="code-block-container">
                <div className="code-block-header">
                    <span className="code-lang-badge">{lang}</span>
                </div>
                <SyntaxHighlighter
                    style={oneDark}
                    language={lang}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        );
    }

    return <code className={`inline-code ${className || ''}`} {...props}>{children}</code>;
}
