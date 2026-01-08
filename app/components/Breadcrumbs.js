import Link from 'next/link';
import { Fragment } from 'react';

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <Fragment key={item.path}>
                            <li className="breadcrumb-separator" aria-hidden="true">/</li>
                            <li className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                {!isLast && item.clickable ? (
                                    <Link href={item.path}>{item.label}</Link>
                                ) : (
                                    <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
