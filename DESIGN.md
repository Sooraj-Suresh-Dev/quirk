<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: Quirk
description: Your LinkedIn, your quirk
---

# Design System: Quirk

## Overview

**Creative North Star: "The Warm Editorial Workshop"**

Quirk is a content generation tool that feels like a creative workshop, not a corporate dashboard. The design blends retro editorial aesthetics with soft brutalism — thick black borders and offset shadows create structure, while warm pastels and serif typography add approachability. The split-view layout (trends on left, generation on right) optimizes the core workflow, and monospace headings give a retro-tech feel that distinguishes Quirk from typical B2B SaaS tools.

**Key Characteristics:**
- Warm, inviting color palette (coral, mint, cream) instead of cold corporate blues
- Soft brutalist styling with thick black borders and offset shadows
- Editorial typography: monospace headings + serif body text
- Split-view dashboard optimized for trend-to-post workflow
- Personality-first design that stands out from LinkedIn's professionalism

## Colors

The palette is warm and inviting, using pastels with black as the structural accent color.

### Primary
- **Warm Coral** (#E8725C): CTAs, active states, primary actions, GitHub source badge
- **Sage Mint** (#8FB8A8): Secondary actions, success states, Product Hunt source badge

### Neutral
- **Warm Cream** (#F5F0E8): Main background, creates inviting atmosphere
- **Soft White** (#FDFBF7): Cards, panels, content surfaces
- **Charcoal** (#2D2D2D): Primary text, headings, body content
- **Warm Gray** (#6B6B6B): Labels, metadata, secondary text
- **Deep Black** (#1A1A1A): Neo-brutalist borders, structural elements

### Named Rules
**The Black Border Rule.** Thick black borders (#1A1A1A) are structural, not decorative. Use them on primary cards, buttons, and inputs to create the neo-brutalist aesthetic. Secondary elements may omit borders.

**The Warmth Rule.** Every background must lean warm (cream, off-white, or pastel). Never use pure white (#FFFFFF) or cool grays that feel corporate.

## Typography

**Display Font:** Space Mono (monospace)
**Body Font:** Playfair Display (serif)
**Label/Mono Font:** Space Mono (for buttons, labels, captions)

**Character:** The pairing creates a retro-editorial feel — monospace headings evoke early computing and technical documentation, while serif body text adds warmth and readability. This combination distinguishes Quirk from typical SaaS tools that use sans-serif throughout.

### Hierarchy
- **Display** (Bold, 32px, uppercase): Hero headlines only — landing page main title
- **Headline** (Bold, 24px, uppercase): Section headers, page titles
- **Title** (Medium, 18px, uppercase): Subsection headers, card titles
- **Body** (Regular, 16px): Content text, descriptions, paragraphs
- **Body Small** (Regular, 14px): Secondary content, metadata
- **Label** (Medium, 14px, uppercase, 0.05em letter-spacing): Buttons, navigation items
- **Caption** (Italic, 12px): Timestamps, fine print,辅助信息

### Named Rules
**The Uppercase Heading Rule.** All headings (H1-H3) are uppercase monospace. This creates the retro-editorial feel and distinguishes Quirk from corporate SaaS tools.

**The Serif Body Rule.** Body text is always serif (Playfair Display). This adds warmth and readability, contrasting with the technical feel of monospace headings.

## Layout

**Split-View Dashboard:** The core interface uses a 40/60 split — left panel for trend discovery, right panel for post generation. This optimizes the primary workflow (select trend → generate post).

**Sidebar Navigation:** Fixed left sidebar (60px width) with icon-based navigation. Vertical layout with clear hierarchy.

**Responsive Breakpoints:**
- Mobile: 375px (single column, stacked layout)
- Tablet: 768px (sidebar collapses, panels stack)
- Desktop: 1024px (full split-view layout)
- Wide: 1280px (max-width containers)

**Spacing Rhythm:** 8px base unit. Consistent spacing between elements (8px, 16px, 24px, 32px, 48px).

## Elevation & Depth

**Neo-Brutalist Shadows:** Depth is conveyed through offset shadows with hard edges, not subtle gradients. Shadows are structural (showing hierarchy) rather than ambient (creating atmosphere).

### Shadow Vocabulary
- **Card Shadow** (`4px 4px 0px #1A1A1A`): Primary cards, containers
- **Card Hover Shadow** (`6px 6px 0px #1A1A1A`): Interactive hover state
- **Button Shadow** (`3px 3px 0px #1A1A1A`): Primary and secondary buttons
- **Button Active Shadow** (`1px 1px 0px #1A1A1A`): Pressed/clicked state
- **Input Shadow** (`2px 2px 0px #1A1A1A`): Form inputs

### Named Rules
**The Offset Shadow Rule.** All shadows use hard-edged offset shadows, never blur or spread. This creates the neo-brutalist aesthetic and ensures shadows are visible and intentional.

**The Hover Expansion Rule.** On hover, shadows expand (from 4px to 6px for cards, 3px to 5px for buttons). This creates a subtle "lift" effect without being corporate or subtle.

## Shapes

**Soft Brutalism:** Rounded corners with thick black borders. The combination creates structure without harshness.

### Corner Radius
- **Cards:** 12px (soft, approachable)
- **Buttons:** 8px (slightly sharper, more technical)
- **Inputs:** 8px (matching buttons)
- **Pills/Tags:** 20px (fully rounded)
- **Avatars:** 50% (circular)

### Borders
- **Primary Cards:** 3px solid #1A1A1A
- **Buttons:** 2px solid #1A1A1A
- **Inputs:** 2px solid #1A1A1A
- **Pills:** 2px solid #1A1A1A
- **Dividers:** 1px solid #E8E8E8 (subtle, not black)

## Components

### Buttons
- **Shape:** 8px radius, 2px solid #1A1A1A border
- **Primary:** Background #E8725C (coral), text #FDFBF7 (white), shadow 3px 3px 0px #1A1A1A
- **Hover:** Shadow expands to 5px 5px 0px #1A1A1A
- **Active:** Shadow contracts to 1px 1px 0px #1A1A1A (pressed effect)
- **Secondary:** Background #FDFBF7, text #2D2D2D, same shadow behavior
- **Ghost:** No background, no border, text #6B6B6B, hover shows subtle background

### Cards
- **Corner Style:** 12px radius
- **Background:** #FDFBF7 (soft white)
- **Shadow Strategy:** Offset shadows (4px 4px 0px #1A1A1A) with hover expansion
- **Border:** 3px solid #1A1A1A
- **Internal Padding:** 24px

### Inputs
- **Style:** 2px solid #1A1A1A stroke, #FDFBF7 background, 8px radius
- **Focus:** Border color changes to #E8725C (coral)
- **Error:** Border color changes to #E85D4A (darker coral/red)
- **Disabled:** Background #F5F0E8 (cream), border color #D0D0D0

### Filter Pills
- **Style:** 2px solid #1A1A1A, 20px radius, #FDFBF7 background
- **Active:** Background becomes source color (GitHub=#E8725C, PH=#8FB8A8, etc.), text #FDFBF7
- **Hover:** Subtle background change to #F5F0E8

### Source Badges
- **GitHub:** #E8725C (coral)
- **Product Hunt:** #8FB8A8 (mint)
- **Hacker News:** #F5A623 (warm yellow)
- **TechCrunch:** #D4A5A5 (dusty rose)
- **Shape:** 4px radius, 2px solid #1A1A1A, padding 4px 8px

### Navigation
- **Style:** Vertical sidebar, 60px width, #F5F0E8 background
- **Icons:** 24px, #2D2D2D (charcoal) default
- **Active:** Background #E8725C (coral), icon #FDFBF7 (white)
- **Hover:** Background #F5F0E8 (cream)
- **Border:** Right border 3px solid #1A1A1A

### Search Bar
- **Style:** Full width, 2px solid #1A1A1A, 8px radius
- **Icon:** Search icon (24px) in #6B6B6B
- **Placeholder:** "Title, author, host, or topic" in #6B6B6B
- **Focus:** Border color changes to #E8725C

### Post Type Selector
- **Style:** Card-based selection with 3 options (Text, Carousel, Image Prompt)
- **Active:** Border color #E8725C, shadow expansion
- **Icon:** Relevant icon for each type
- **Label:** Uppercase Space Mono

## Do's and Don'ts

### Do:
- **Do** use thick black borders (#1A1A1A) on primary cards and buttons — this is the core neo-brutalist aesthetic
- **Do** use warm pastels (coral, mint, cream) for backgrounds and accents — never cold blues or grays
- **Do** use offset shadows (hard-edged, no blur) for depth — this creates the brutalist feel
- **Do** use uppercase monospace for headings — this creates the retro-editorial feel
- **Do** use serif for body text — this adds warmth and readability
- **Do** use the split-view layout for the dashboard — optimize for trend-to-post workflow
- **Do** use source-specific badge colors — maintain consistency across the interface

### Don't:
- **Don't** use pure white (#FFFFFF) for backgrounds — always use warm cream (#F5F0E8) or soft white (#FDFBF7)
- **Don't** use subtle/blurry shadows — always use hard-edged offset shadows
- **Don't** use sans-serif for body text — always use Playfair Display (serif)
- **Don't** use cold corporate colors — avoid blues, cool grays, and sterile whites
- **Don't** use thin borders (1px) on primary elements — use 2-3px for the brutalist aesthetic
- **Don't** mix brutalist and corporate styles — commit fully to the warm brutalist aesthetic
- **Don't** use uppercase for body text — only for headings, labels, and buttons
