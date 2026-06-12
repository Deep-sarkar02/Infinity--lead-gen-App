# Infinity Learn — Brand Tokens
## Extracted from `54_IL_Web` (Home screen reference)

| Field | Value |
|-------|-------|
| **Source** | Figma file `54_IL_Web` — Home dashboard screenshot |
| **Reference** | [Figma link](https://www.figma.com/design/uRhDNtLgAYOma6RH80TSON/54_IL_Web?node-id=3-19968) |
| **Local assets** | `assets/il-web-home-reference.png`, `assets/il-sidebar-reference.png`, `assets/infinity-learn-color-palette.png` |
| **Date** | June 11, 2026 |
| **Note** | Hex values are sampled from the reference image. Verify against Figma variables when API access is available. |

---

## 1. Logo

| Asset | Path | Usage |
|-------|------|-------|
| **Official logo (white)** | `client/public/logo-white.png` | Sidebar (blue bg), login (black card) |
| **Source archive** | `assets/infinity-learn-logo-white.png` | Design reference |

**Logo contents:** "Infinity Learn" wordmark + chevron graphic + "BY SRI CHAITANYA" arc.

| Context | Implementation |
|---------|----------------|
| **Login** (white page) | Logo on black rounded card + "Runner" tag below |
| **Sidebar** (blue `#0162C9`) | White logo via `mix-blend-lighten` on blue background |
| **Collapsed sidebar** | Small logo icon (`sm` size) |

---

## 2. Color Palette (Official)

> Full scale in `client/src/styles/tokens.css`. Sampled from `assets/infinity-learn-color-palette.png`.

### 2.1 Primary — Blue

| Token | Hex |
|-------|-----|
| `il-blue-10` | `#012F63` |
| `il-blue-20` | `#014A99` |
| `il-blue-30` | `#0162C9` |
| `il-blue-40` | `#027BFE` |
| `il-blue-50` | `#3395FF` |
| `il-blue-60` | `#67B0FD` |
| `il-blue-70` | `#98CAFF` |
| `il-blue-80` | `#CBE5FE` |
| `il-blue-90` | `#E6F2FF` |
| `il-blue-100` | `#FFFFFF` |

**App aliases:** `il-primary` = blue-30 · `il-primary-dark` = blue-10 · `il-primary-hover` = blue-20 · `il-primary-light` = blue-90

### 2.2 Secondary — Yellow

| Token | Hex |
|-------|-----|
| `il-yellow-50` | `#FCDE5C` |
| `il-yellow-60` | `#FDE57B` |
| `il-yellow-90` | `#FEF8DE` |
| `il-yellow-95` | `#FFFBEF` |

### 2.3 Tertiary — Orange

| Token | Hex |
|-------|-----|
| `il-orange-50` | `#FF7900` |
| `il-orange-60` | `#FF9533` |
| `il-orange-90` | `#FFE4CC` |

### 2.4 Neutral

| Token | Hex |
|-------|-----|
| `il-neutral-10` | `#090E14` |
| `il-neutral-30` | `#393E44` |
| `il-neutral-50` | `#6D6E72` |
| `il-neutral-80` | `#CDCED0` |
| `il-neutral-90` | `#E6E7E9` |
| `il-neutral-100` | `#FFFFFF` |

### 2.5 Success — Green

| Token | Hex |
|-------|-----|
| `il-success-60` | `#37C65A` |
| `il-success-95` | `#D5F5DE` |

### 2.6 Error — Red

| Token | Hex |
|-------|-----|
| `il-error-60` | `#EE413A` |
| `il-error-95` | `#FDEBEB` |

### 2.7 Warning — Amber

| Token | Hex |
|-------|-----|
| `il-warning-60` | `#FFAB00` |
| `il-warning-95` | `#FEEECC` |

### 2.8 Text

| Token | Hex |
|-------|-----|
| `il-text-primary` | `#101010` |
| `il-text-secondary` | `#666666` |
| `il-text-muted` | `#A9A9A9` |
| `il-text-disabled` | `#D9D9D9` |

### 2.9 Background

| Token | Hex | Usage |
|-------|-----|-------|
| `il-bg-navy` | `#00364E` | Dark surfaces |
| `il-bg-white` | `#FFFFFF` | Cards |
| `il-bg-blue-tint` | `#D4E8FF` | Tinted sections |
| `il-bg-grey-tint` | `#F1F2F6` | Page background |

### 2.10 Purple

| Token | Hex |
|-------|-----|
| `il-purple-50` | `#7B4BFF` |
| `il-purple-80` | `#BBA3FB` |

### 2.11 Gradient

`linear-gradient(180deg, #0162C9 0%, #012F63 100%)`

### 2.12 App semantic shortcuts

| Token | Maps to | Usage |
|-------|---------|-------|
| `il-success` | success-60 | Verified leads |
| `il-success-bg` | success-95 | Verified stat card |
| `il-warning` | warning-60 | Unverified leads |
| `il-warning-bg` | warning-95 | Unverified stat card |
| `il-error` | error-60 | Errors, live badge |
| `il-pastel-blue` | blue-90 | Info cards |
| `il-pastel-green` | success-95 | Success cards |
| `il-pastel-yellow` | yellow-95 | Milestone accent |

---

## 3. Typography

| Token | Value | Usage |
|-------|-------|-------|
| **Font family** | `'Inter', system-ui, -apple-system, sans-serif` | All UI text (matches IL web) |
| **Page title** | 28–32px / 700 | "Home" heading |
| **Section title** | 18–20px / 600 | "Choose a Subject", "Join free live classes" |
| **Card title** | 16px / 600 | Class names, card headings |
| **Body** | 14–16px / 400 | Descriptions, labels |
| **Caption** | 12px / 400 | Timestamps, view counts, footer links |
| **Button** | 14–16px / 600 | CTAs ("Join", "Enrol", "Add Lead") |

---

## 4. Spacing & layout

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight gaps |
| `space-sm` | 8px | Icon gaps, inline spacing |
| `space-md` | 16px | Card padding, section gaps |
| `space-lg` | 24px | Between sections |
| `space-xl` | 32px | Page margins |
| **Content max-width** | 1200px (web) / 100% (mobile Runner) | Main area |
| **Sidebar width** | ~240px (web only; Runner uses bottom nav) | IL web pattern |

---

## 5. Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Inputs, small chips |
| `radius-md` | 12px | Buttons |
| `radius-lg` | 16px | Cards, banners (primary IL pattern) |
| `radius-xl` | 24px | Hero banners, large cards |
| `radius-full` | 9999px | Avatars, nav pills, badges |

---

## 6. Shadows & borders

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 3px rgba(0, 0, 0, 0.08)` | Subject cards, stat cards |
| `shadow-elevated` | `0 4px 12px rgba(0, 0, 0, 0.1)` | Modals, milestone popup |
| `border-subtle` | `1px solid #E5E7EB` | Card outlines, dividers |
| `border-dashed` | `2px dashed #D1D5DB` | Upload areas (doubt box pattern) |

---

## 7. Components (observed patterns)

| Component | IL Web pattern | Infinity Runner adaptation |
|-----------|----------------|----------------------------|
| **Primary button** | Blue fill `#0056D2`, white text, 12px radius | "Add Lead", "Continue with Google" border style |
| **Outline button** | Blue border, blue text, white bg | "Create a Test Now" style for secondary actions |
| **Nav active state** | White pill on blue sidebar | Bottom tab active: blue text + light blue bg |
| **Live badge** | Red `#EF4444` pill, white text | Optional for real-time features |
| **Stat card** | Pastel bg + icon + label | Verified / Unverified / Total leads |
| **Hero banner** | Pastel yellow + wavy graphic | Milestone celebration modal accent |
| **Avatar** | Circular, 40px | Google profile photo in header |

---

## 8. CSS variables (ready for implementation)

```css
:root {
  /* Primary */
  --il-primary: #0056D2;
  --il-primary-dark: #003D99;
  --il-primary-light: #E8F1FC;
  --il-primary-hover: #004BB5;

  /* Neutrals */
  --il-white: #FFFFFF;
  --il-gray-50: #F8F9FA;
  --il-gray-100: #F0F2F5;
  --il-gray-400: #9CA3AF;
  --il-gray-600: #6B7280;
  --il-gray-900: #1F2937;

  /* Semantic */
  --il-success: #22C55E;
  --il-success-bg: #DCFCE7;
  --il-warning: #F59E0B;
  --il-warning-bg: #FEF3C7;
  --il-error: #EF4444;

  /* Pastels */
  --il-pastel-blue: #D6EAF8;
  --il-pastel-green: #D5F5E3;
  --il-pastel-yellow: #FCF3CF;

  /* Radius */
  --il-radius-sm: 8px;
  --il-radius-md: 12px;
  --il-radius-lg: 16px;
  --il-radius-full: 9999px;

  /* Typography */
  --il-font: 'Inter', system-ui, -apple-system, sans-serif;
}
```

---

## 9. PWA / mobile theme

```json
{
  "theme_color": "#0056D2",
  "background_color": "#FFFFFF"
}
```

---

## 10. Infinity Runner screen mapping

| Runner screen | IL tokens to use |
|---------------|------------------|
| **Login** | White bg, `--il-primary` for Google button border/accent, logo centered |
| **Dashboard** | White bg, pastel stat cards, `--il-primary` progress bar |
| **Add Lead** | White card form, `--il-radius-lg`, primary Save button |
| **Milestone modal** | `--il-pastel-yellow` accent, `--il-primary-dark` header option |
| **Wallet** | Card layout like "Resume learning" thumbnails, pastel card backgrounds |

---

*Source: IL Web Home dashboard screenshot. Reconcile exact values with Figma design tokens when MCP access to `54_IL_Web` is available.*
