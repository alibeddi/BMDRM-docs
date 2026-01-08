---
title: "Storyblok Integration & Migration Roadmap"
category: "Planning"
---

This document outlines the master plan to transition the Wellvitas website from its current "hybrid-static" state to a fully dynamic, CMS-driven architecture using Storyblok and Next.js 15 (RSC).

---

## 1. Project Objective
Decouple content management from the codebase. Enable the "Boss" to edit 100% of the site's text, images, navigation, and services via the Storyblok Visual Editor, while maintaining the performance and security of a **Static Export** (`output: 'export'`) deployed to Fasthosts.

---

## 2. Technical Architecture Recap
*   **Framework**: Next.js 15 (App Router) + React 19.
*   **CMS**: Storyblok (Headless).
*   **Rendering Strategy**: React Server Components (RSC) for build-time generation.
*   **Deployment**: GitHub Actions → FTP (Fasthosts).
*   **Dynamic Bridges**: 
    *   `src/lib/storyblok.js` (Server-side registry).
    *   `src/components/StoryblokProvider.jsx` (Client-side Visual Editor bridge).

---

## 3. Phase 1: Data Binding & Component Logic (High Priority)
Currently, many components are "Empty Wrappers" that ignore the Storyblok `blok` data.

### 3.1. Hero Carousel (`hero_carousel`)
*   **Status**: `HeroCarouselBlok.jsx` is static.
*   **Action**: 
    *   Modify `src/components/HeroCarousel.js` to accept a `slides` array.
    *   Map `blok.slides` to the component props.
    *   In Storyblok: Create a "Nestable" block called `hero_slide` with fields: `image`, `title`, `link_url`, `alt_text`.

### 3.2. Home Therapies (`home_therapies`)
*   **Status**: Loads from `src/lib/therapies.js`.
*   **Action**:
    *   Bind `HomeTherapies.js` to a `therapies` list from Storyblok.
    *   Option A: Use a "Relationship" field in Storyblok to select specific therapy stories.
    *   Option B: Use a "Blocks" field to add therapies directly to the homepage.

### 3.3. Treatment Packages (`packages_section`)
*   **Status**: Static scroller.
*   **Action**: 
    *   Define the `package_card` schema (Title, Features, Price, Link).
    *   Bind `TreatmentPackagesScroller.js` to the dynamic array.

---

## 4. Phase 2: Global Configuration (Header/Footer)
Currently, navigation and contact info are hardcoded in `Header.js` and `Footer.js`.

1.  **Global Story**: Create a Storyblok story with the slug `global` (Content Type: `settings`).
2.  **Fields**:
    *   `navigation_items`: Multilink/Blocks for the header.
    *   `footer_contact_info`: Textarea/Fields for Address, Phone, Email.
    *   `social_links`: Blocks for Instagram/WhatsApp.
3.  **Implementation**:
    *   Update `src/app/layout.js` to fetch the `global` story at build time.
    *   Pass this data to the `Header` and `Footer` via props or a Context Provider.

---

## 5. Phase 3: Static Export Optimization
Since the site is hosted on Fasthosts (Static), we must ensure all pages are pre-rendered.

1.  **`generateStaticParams`**:
    *   Implement this in `src/app/[...slug]/page.js`.
    *   Fetch all routes from Storyblok API (`cdn/links`) to tell Next.js which paths to export.
2.  **Dynamic Redirects**:
    *   Ensure the `middleware.js` correctly handles Storyblok's `_storyblok` preview param without breaking the static build.

---

## 4. Phase 4: Content Migration Strategy
1.  **Therapies**: Individual stories for each therapy (e.g., `/therapies/hyperbaric-oxygen`).
2.  **Schema**: Create a "Full Page" schema for therapies including:
    *   Benefits (Rich Text).
    *   Pricing Table.
    *   Conditions Treated (Tags/List).
    *   Gallery.
3.  **Relationship Binding**: The "How to Book" flow should pull its therapy list dynamically from these stories.

---

## 5. Phase 5: Visual Editor & Preview Setup
To allow real-time editing, we need the "Visual Editor Bridge" fully operational.

1.  **Proxy Server**: Use `npm run proxy` (localhost:3010) to bypass CORS in the Storyblok iframe.
2.  **Bridge Script**: Ensure the `<script src="...storyblok-v2-latest.js" />` is only loaded during development or preview mode.
3.  **Draft Mode**: Finalize `/api/draft` and `/api/disable-draft` for Secure Previewing via the Storyblok Dashboard.

---

## 6. Implementation Timeline (Estimated)

| Phase | Task | Duration |
|-------|------|----------|
| **1** | Binding Homepage Components (Hero, Intro, Packages) | 2 Days |
| **2** | Global Settings (Header/Footer/Contact) | 1 Day |
| **3** | Static Export & Route Generation Support | 1 Day |
| **4** | Content Migration (All Therapies & Info Pages) | 3 Days |
| **5** | CI/CD Webhooks & Production Secrets Setup | 1 Day |

---

## 7. Immediate Remarks for the Owner
*   **Storyblok Access**: I need the **Space Access Token** and **Space ID** verified to begin Phase 1.
*   **Supabase Transition**: The Booking Flow currently has dummy Supabase keys. These must be replaced with production keys to handle health screening data securely.
*   **Media Assets**: High-resolution versions of all therapy images should be uploaded to the Storyblok Asset Manager.

---
**Version**: 1.0  
**Prepared By**: Antigravity (Advanced AI Coding Assistant)  
**Status**: Ready for Implementation
