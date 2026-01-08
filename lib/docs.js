import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'docs');

// Helper to recursively get all files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file.name).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file.name, arrayOfFiles);
        } else {
            if (file.name.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file.name));
            }
        }
    });

    return arrayOfFiles;
}

export function getAllDocs() {
    const files = getAllFiles(docsDirectory);
    return files.map(file => {
        const relativePath = path.relative(docsDirectory, file);
        const slug = relativePath.replace(/\.md$/, '').split(path.sep);
        return { slug };
    });
}

export function getDocTree(dir = docsDirectory) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    const tree = files.map(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            // Check for index.md in the folder
            const indexPath = path.join(fullPath, 'index.md');
            let indexData = null;
            if (fs.existsSync(indexPath)) {
                const indexContent = fs.readFileSync(indexPath, 'utf8');
                const matterResult = matter(indexContent);
                indexData = {
                    title: matterResult.data.title,
                    order: matterResult.data.order,
                    path: path.relative(docsDirectory, indexPath).replace(/\/index\.md$/, '') // Path effectively points to folder
                };
            }

            const children = getDocTree(fullPath).filter(child => child.name !== 'index');

            return {
                type: 'folder',
                name: file.name,
                title: indexData?.title || file.name.charAt(0).toUpperCase() + file.name.slice(1).replace(/-/g, ' '),
                order: indexData?.order || 999,
                path: indexData ? indexData.path : null, // If it has an index, it has a path
                children: children
            };
        } else if (file.name.endsWith('.md')) {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);
            const id = file.name.replace(/\.md$/, '');
            const relativePath = path.relative(docsDirectory, fullPath).replace(/\.md$/, '');

            return {
                type: 'file',
                name: id,
                path: relativePath,
                title: matterResult.data.title || id,
                order: matterResult.data.order || 999, // Frontmatter order or end
                category: matterResult.data.category
            };
        }
        return null;
    }).filter(Boolean);

    // Sorting: by order (asc), then title (asc)
    return tree.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
    });
}

// Helper: Flatten tree for Pagination (Prev/Next)
export function getFlattenedDocs(tree = null) {
    if (!tree) tree = getDocTree();

    let flat = [];
    tree.forEach(item => {
        if (item.type === 'file') {
            flat.push(item);
        } else if (item.type === 'folder') {
            // If folder has an index page (path exists), add it as a navigable page
            if (item.path) {
                flat.push(item);
            }
            flat = [...flat, ...getFlattenedDocs(item.children)];
        }
    });
    return flat;
}

export function getDocData(slugArray) {
    const relativePath = slugArray.join('/');
    let fullPath = path.join(docsDirectory, `${relativePath}.md`);

    // Check if file exists, or try index.md
    if (!fs.existsSync(fullPath)) {
        // Try folder/index.md
        const indexPath = path.join(docsDirectory, `${relativePath}/index.md`);
        if (fs.existsSync(indexPath)) {
            fullPath = indexPath;
            // relativePath stays the same for slug purposes, or we could update it. 
            // But content loading basically just needs the correct fullPath.
        } else {
            throw new Error(`Document not found: ${fullPath} or index.md`);
        }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // simple regex to extract headings for TOC
    const headings = [];
    const lines = fileContents.split('\n');
    lines.forEach(line => {
        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
            headings.push({
                level: match[1].length,
                text: match[2],
                id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
            });
        }
    });

    return {
        slug: relativePath,
        content: matterResult.content,
        headings,
        ...matterResult.data,
    };
}
