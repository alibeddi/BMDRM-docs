const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apiadmin.bmdrm.com';

export async function getDocsTree() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/public/docs/tree`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch docs tree: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching docs tree:', error);
        return [];
    }
}

export async function getDocPaths() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/public/docs/paths`, { cache: 'no-store' }); // Ensure fresh paths on build
        if (!res.ok) {
            throw new Error(`Failed to fetch doc paths: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching doc paths:', error);
        return [];
    }
}

export async function getDocBySlug(slugParts) {
    try {
        const slugPromise = Array.isArray(slugParts) ? slugParts.join('/') : slugParts;
        // Handle root or index if needed, but usually slug is path
        const res = await fetch(`${API_BASE_URL}/api/public/docs/pages/${slugPromise}`, {
            next: { revalidate: 60 }
        });

        if (res.status === 404) {
            return null;
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch doc content: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`Error fetching doc ${slugParts}:`, error);
        return null;
    }
}

function normalizeTree(tree) {
    if (!tree) return [];

    return tree.map(item => {
        const path = item.slug || item.path;

        const hasContent = item.content && item.content.trim().length > 0;
        const isClickable = item.type === 'file' || (item.type === 'folder' && hasContent);

        return {
            ...item,
            id: item.id || path || item.name,
            path: path,
            isClickable: isClickable,
            children: item.children ? normalizeTree(item.children) : []
        };
    });
}

export async function getDocsTreeNormalized() {
    const tree = await getDocsTree();
    return normalizeTree(tree);
}

export function getFlattenedDocs(tree = []) {
    let flat = [];
    tree.forEach(item => {
        if (item.type === 'file') {
            flat.push(item);
        } else if (item.type === 'folder') {
            if (item.isClickable) {
                flat.push(item);
            }
            if (item.children) {
                flat = [...flat, ...getFlattenedDocs(item.children)];
            }
        }
    });
    return flat;
}
