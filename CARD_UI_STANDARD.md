# Card UI Standard - CMDI Credit Pricing Admin
## 2025/2026 Design System

### Core Principles
1. **Consistency**: All cards follow the same visual language
2. **Readability**: Dark text on light backgrounds, no white-on-white
3. **Compact**: Efficient use of space without feeling cramped
4. **Responsive**: Adapts gracefully to all screen sizes
5. **Accessible**: Proper contrast ratios and truncation

---

## Card Types

### 1. **Base Card** (`components/ui/Card.tsx`)
**Usage**: General-purpose container for content sections

**Specifications:**
- Border: `border border-gray-200`
- Background: `bg-white`
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-sm` (default), `shadow-md` (hover)
- Padding: Configurable via props (`p-0`, `p-4`, `p-5`, `p-6`)

**Header (optional):**
- Background: `bg-gradient-to-r from-gray-50 to-white`
- Border: `border-b border-gray-200`
- Padding: `px-5 py-4`
- Icon size: `w-4 h-4` in `p-2` container
- Title: `text-base font-bold text-gray-900`

**Hover Effect:**
- Transform: `y: -2px`
- Shadow: `shadow-sm` → `shadow-md`
- Border: `border-gray-200` → `border-brand-200`

---

### 2. **KPI Card** (`components/ui/KpiCard.tsx`)
**Usage**: Display key metrics and statistics

**Specifications:**
- Border: `border border-gray-200`
- Background: `bg-white`
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-sm` (default), `shadow-md` (hover)
- Padding: `p-4 sm:p-5` (responsive - smaller on mobile)

**Layout:**
```
┌─────────────────────────────┐
│ TITLE (xs, uppercase)   [🎨]│
│ $1,645.00 (2xl, bold)       │
│ Current Month (xs, gray)    │
└─────────────────────────────┘
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (gradient bar)
```

**Text Sizes (UPDATED 2025):**
- Title: `text-xs font-semibold text-gray-500 uppercase line-clamp-2 leading-tight`
  - **CHANGED**: Now uses `line-clamp-2` instead of `truncate` to show up to 2 lines
- Value: `text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 leading-tight break-words`
  - **CHANGED**: Fully responsive sizing (`text-lg` mobile → `text-xl` tablet → `text-2xl` desktop)
  - **CHANGED**: Uses `line-clamp-2` to allow wrapping to 2 lines for long feature names
  - **CHANGED**: Added `break-words` to prevent overflow
- Subtext: `text-xs text-gray-600 truncate`
  - **UNCHANGED**: Single line truncate (less critical information)

**Icon:**
- Container: `rounded-lg p-2 sm:p-2.5` with gradient background (responsive padding)
- Icon size: `w-4 h-4 sm:w-5 sm:h-5 text-white` (responsive sizing)
- Position: Top-right, `flex-shrink-0`

**Gradient Bar:**
- **REMOVED** (2025 update - cleaner, more minimal design)
- The colored icon badge provides sufficient visual accent
- Reduces visual noise and improves focus on content

**Variants:**
- `default`: Red (`from-brand-500 to-brand-600`)
- `success`: Green (`from-green-500 to-emerald-600`)
- `warning`: Orange (`from-amber-500 to-orange-600`)
- `info`: Blue (`from-blue-500 to-blue-600`)
- `danger`: Red (`from-red-500 to-red-600`)

**Hover Effect:**
- Transform: `y: -2px, scale: 1.01`
- Shadow: `shadow-sm` → `shadow-md`

---

### 3. **Section Headers**
**Usage**: Headers for card groups (Quick Links, Client Alerts)

**Specifications:**
- Text: `text-lg font-bold text-gray-900`
- Margin: `mb-4`
- Indicator bar: `w-1 h-5 bg-gradient-to-b rounded-full mr-2.5`

---

### 4. **Alert/List Items**
**Usage**: Individual items in Client Alerts section

**Specifications:**
- Padding: `p-2.5`
- Border radius: `rounded-lg`
- Border: `border` (color varies by type)
- Background: Tinted (e.g., `bg-orange-50` for upsell)
- Text: `text-xs font-medium text-gray-900`

**Hover:**
- Border color intensifies
- Background color intensifies

---

## Spacing Standards

### Grid Gaps
- KPI Cards: `gap-4`
- Section Columns: `gap-6`
- List Items: `space-y-2` or `space-y-2.5`

### Vertical Spacing
- Between major sections: `space-y-6`
- Within cards: `mb-6` for subsections
- Between list items: `space-y-2`

### Padding
- KPI Cards: `p-5`
- Base Cards: `p-5` (default)
- List Items: `p-2.5`
- Card Headers: `px-5 py-4`

---

## Typography Standards

### Font Weights
- Headers: `font-bold`
- Subheaders: `font-semibold`
- Body: `font-medium`
- Labels: `font-semibold`

### Text Sizes
- Page titles: `text-2xl`
- Section headers: `text-lg`
- Card titles: `text-base`
- KPI titles: `text-xs uppercase`
- KPI values: `text-2xl`
- Body text: `text-sm`
- Small text: `text-xs`

### Text Colors
- Primary: `text-gray-900` (dark, high contrast)
- Secondary: `text-gray-600`
- Muted: `text-gray-500`
- **NEVER**: White text on white background

---

## Icon Standards

### Sizes
- Small: `16px` (w-4 h-4) - Used in card headers, alerts
- Medium: `20px` (w-5 h-5) - Used in KPI cards
- Large: `28px` (w-7 h-7) - Rarely used

### Colors
- Active state: `text-white` (on gradient background)
- Inactive state: `text-brand-600` or `text-gray-600`
- **NEVER**: White icon on white background

---

## Responsive Breakpoints

### KPI Cards
- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns
- Desktop (1024px+): 3 columns

### Section Columns (Quick Links + Alerts)
- Mobile/Tablet (< 1024px): 1 column (stacked)
- Desktop (1024px+): 2 columns (side-by-side)

---

## Truncation Rules (UPDATED 2025)

### Text Overflow Strategy
**Priority-based approach**: More important content gets more lines before truncating

### When to Use Each Method

#### 1. **`line-clamp-2`** (Preferred for important content)
- **Use for**: Card titles, feature names, primary values
- **Reason**: Shows full content on 2 lines before truncating
- **Example**: "Highest Revenue Feature" → Shows full text
- **Classes**: `line-clamp-2 leading-tight break-words`

#### 2. **`truncate`** (Use for secondary content)
- **Use for**: Subtexts, descriptions, less critical labels
- **Reason**: Saves vertical space for less important info
- **Example**: "Current Month" → Single line
- **Classes**: `truncate`

#### 3. **Responsive Font Sizing**
- **Use for**: Large text that might overflow on mobile
- **Pattern**: `text-xl sm:text-2xl` (smaller on mobile, larger on desktop)
- **Example**: KPI values, currency amounts

### Required Pattern for Flex Truncation
```tsx
<div className="flex items-center gap-3">
  <div className="flex-1 min-w-0">
    {/* Important content - allow 2 lines */}
    <p className="line-clamp-2 leading-tight" title={fullText}>
      {fullText}
    </p>
    {/* Secondary content - single line */}
    <p className="truncate" title={subtext}>
      {subtext}
    </p>
  </div>
  <div className="flex-shrink-0">
    <button>Action</button>
  </div>
</div>
```

**Apply to:**
- KPI card titles and values (use `line-clamp-2`)
- Client names in lists (use `truncate`)
- Feature names (use `line-clamp-2`)
- All card content

**Key Points:**
- Parent must have `flex-1 min-w-0` for truncation to work
- Buttons/icons should have `flex-shrink-0` to prevent squishing
- Always add `title` attribute for truncated text (provides tooltip)
- Use `leading-tight` with `line-clamp-*` to reduce line height
- Add `break-words` to prevent long unbreakable strings from overflowing

---

## Button Standards in Cards

### Sizes
- Default: `size="sm"` in compact lists
- Text: `text-xs` for compact layouts

### Variants
- Primary actions: `variant="primary"`
- Secondary actions: `variant="secondary"`

### Layout
- Always: `flex-shrink-0` to prevent squishing
- Spacing: `gap-2.5` or `gap-3` from adjacent content

