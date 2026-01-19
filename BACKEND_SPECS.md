# Backend API Structure for Documentation System

This plan outlines the database model and API endpoints required to build a dynamic documentation backend with a management dashboard.

## 1. Database Schema (Conceptual)

You need a table to store both Folders and Files. Let's call it `DocItems`.

**Table: `DocItems`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID/Int | Unique Identifier |
| `type` | Enum | `folder` or `file` |
| `title` | String | Display name (e.g., "Getting Started") |
| `slug` | String | URL safe part (e.g., "getting-started"). Full path is derived from parents. |
| `content` | Text | Markdown. **Crucial**: If a `folder` has content, it acts as an **Index Page** (clickable). |
| `parent_id` | UUID/Int | ID of parent item. Creates the nested tree structure. |

### 🔑 Key Logic: Handling Index Pages & Nesting
In a file system, you have a folder `Guides/` and a file `Guides/index.md`.
In the Database, strictly merge these into **One Row**:
- **Item**: `Guides` (Type: Folder)
- **Has Children?**: Yes (it's a container).
- **Has Content?**: Yes (it's a page).
- **Result**: The API treats it as a **Clickable Folder** (exactly what we built in the Sidebar).

**Do NOT** create a child item named "index". Just put the text in the Folder row itself.

| `order_index` | Int | For sorting items in the sidebar |
| `is_published` | Boolean | To save drafts before showing them |

---

## 2. Public API (For the Docs Website)
*These endpoints are used by your Next.js Docs site to fetch content.*

### A. Get Navigation Tree
Used by the **Sidebar**. Returns nested JSON.
- **GET** `/api/v1/public/tree`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Getting Started",
      "type": "folder",
      "slug": "getting-started",
      "children": [
        { "id": 2, "title": "Installation", "slug": "getting-started/installation", "type": "file" }
      ]
    }
  ]
  ```

### B. Get Page Content
Used by the **Document Page**. Finds file by full slug path.
- **GET** `/api/v1/public/pages/:slug*` (e.g. `/pages/getting-started/installation`)
- **Response**:
  ```json
  {
    "id": 2,
    "title": "Installation",
    "content": "# Markdown Content Here...",
    "last_updated": "2024-01-15T10:00:00Z"
  }
  ```

### C. Get All Paths (SSG)
Used by `generateStaticParams` to build all pages.
- **GET** `/api/v1/public/paths`
- **Response**: `["intro", "getting-started/installation", "api/auth"]`

---

## 3. Admin API (For the Dashboard)
*These endpoints are used by your Admin Dashboard to manage content.*

### A. List Items (Flat or Tree)
View all files to manage them.
- **GET** `/api/v1/admin/items`

### B. Create Item
Add a new Folder or File.
- **POST** `/api/v1/admin/items`
- **Body**:
  ```json
  {
    "type": "file",
    "title": "New Guide",
    "parent_id": 5,
    "content": "Initial draft..."
  }
  ```

### C. Update Item
Save content or rename.
- **PUT** `/api/v1/admin/items/:id`
- **Body**: `{ "title": "New Title", "content": "Updated markdown..." }`

### D. Reorder Items
Drag and drop sorting in the dashboard.
- **POST** `/api/v1/admin/items/reorder`
- **Body**: `{ "items": [{ "id": 2, "order": 1 }, { "id": 3, "order": 2 }] }`

### E. Delete Item
- **DELETE** `/api/v1/admin/items/:id`
