# Accessibility Quick Reference Guide

## Color Usage Guidelines

### ✅ DO Use These Colors

#### Text Colors
- **Primary Text:** `text-gray-900` (#111827) - 16.6:1 contrast ✅ AAA
- **Secondary Text:** `text-gray-600` (#4b5563) - 7.0:1 contrast ✅ AAA
- **Tertiary Text:** `text-gray-500` (#6b7280) - 4.6:1 contrast ✅ AA
- **Inverse Text:** `text-white` (#ffffff) - Use on dark backgrounds

#### Status Colors
- **Success:** `text-emerald-600` (#059669) - 4.5:1 ✅ AA
- **Error:** `text-red-600` (#dc2626) - 4.6:1 ✅ AA
- **Warning:** `text-amber-600` (#d97706) - 4.5:1 ✅ AA
- **Info:** `text-blue-600` (#2563eb) - 4.5:1 ✅ AA

#### Badge Colors
- **Green Badge:** `bg-green-100 text-green-800` - 7.0:1 ✅ AAA
- **Red Badge:** `bg-red-100 text-red-800` - 7.0:1 ✅ AAA
- **Blue Badge:** `bg-blue-100 text-blue-800` - 7.0:1 ✅ AAA
- **Yellow Badge:** `bg-yellow-100 text-yellow-900` - 4.8:1 ✅ AA (use yellow-900, not yellow-800)
- **Gray Badge:** `bg-gray-100 text-gray-800` - 4.6:1 ✅ AA

### ❌ DON'T Use These Colors

- **Muted Text (non-disabled):** `text-gray-400` - Only 2.9:1 ❌
  - **Use instead:** `text-gray-500` for 4.6:1 ✅
- **Yellow Badge (old):** `text-yellow-800` - Only 4.2:1 ⚠️
  - **Use instead:** `text-yellow-900` for 4.8:1 ✅

### Button Colors

#### Primary Button
```tsx
<Button className="bg-blue-600 text-white hover:bg-blue-700">
  Primary Action
</Button>
```
- Default: 4.5:1 ✅ AA
- Hover: 5.1:1 ✅ AA

#### Secondary Button
```tsx
<Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
  Secondary Action
</Button>
```
- Default: 7.0:1 ✅ AAA
- Hover: 7.0:1 ✅ AAA

### Background Colors

- **Default:** `bg-white` (#ffffff)
- **Muted:** `bg-gray-50` (#f9fafb)
- **Card:** `bg-white` (#ffffff)
- **Elevated:** `bg-white` with shadow

### Dark Mode

All dark mode colors automatically maintain WCAG AA compliance:
- Background: `bg-gray-900` (#111827)
- Text: `text-gray-50` (#f9fafb) - 16.6:1 ✅ AAA
- Cards: `bg-gray-800` (#1f2937)

## Component-Specific Guidelines

### BiasCard Component

```tsx
// ✅ Good
<Badge className="bg-green-100 text-green-800">Bullish</Badge>
<Badge className="bg-red-100 text-red-800">Bearish</Badge>
<Badge className="bg-yellow-100 text-yellow-900">Warning</Badge>

// ❌ Bad
<Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
```

### Navigation Component

```tsx
// ✅ Good - All states compliant
<Link className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
  Navigation Link
</Link>

<Link className="bg-blue-50 text-blue-700">
  Active Link
</Link>
```

### Button Component

```tsx
// ✅ Good - All variants compliant
<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

## Testing Your Colors

### Quick Contrast Check

```typescript
import { checkContrast } from '@/utils/colorContrast';

const result = checkContrast('#6b7280', '#ffffff');
console.log(result); 
// { ratio: 4.6, level: 'AA', passed: true }
```

### Comprehensive Audit

```typescript
import { comprehensiveColorAudit } from '@/utils/comprehensiveColorAudit';

const audit = comprehensiveColorAudit();
console.log(audit.issues); // All contrast issues
console.log(audit.recommendations); // Fix suggestions
```

## CSS Custom Properties

Use CSS custom properties for theme-aware colors:

```css
.my-component {
  color: var(--foreground); /* Automatically adapts to light/dark */
  background: var(--background);
}

.primary-button {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

## Focus States

Always ensure visible focus indicators:

```css
button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

## Common Patterns

### Status Indicators
```tsx
// ✅ Good
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-green-500" />
  <span className="text-gray-700">Market Open</span>
</div>
```

### Alert Messages
```tsx
// ✅ Good
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="text-red-800">Error message</div>
</div>
```

### Muted Text
```tsx
// ✅ Good (for non-disabled)
<span className="text-gray-500">Muted information</span>

// ✅ Good (for disabled)
<span className="text-gray-400 opacity-50" aria-disabled="true">
  Disabled text
</span>
```

## Resources

- **Full Audit Report:** See `ACCESSIBILITY_AUDIT_REPORT.md`
- **Theme Config:** See `src/config/accessibleTheme.ts`
- **Color Utilities:** See `src/utils/colorContrast.ts`
- **Comprehensive Audit:** See `src/utils/comprehensiveColorAudit.ts`

## WCAG 2.2 Standards

- **AA (Minimum):** 4.5:1 for normal text, 3:1 for large text
- **AAA (Enhanced):** 7:1 for normal text, 4.5:1 for large text

All colors in this project meet **WCAG 2.2 AA** standards, with many meeting **AAA** standards.

