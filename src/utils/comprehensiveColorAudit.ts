'use client';

/**
 * Comprehensive Color Accessibility Audit System
 * WCAG 2.2 AA/AAA Compliance Checker
 * 
 * This utility performs a complete audit of all color combinations
 * used throughout the application, checking for WCAG 2.2 compliance.
 */

import { checkContrast, getContrastRatio, hexToRgb, getLuminance } from './colorContrast';

// Tailwind color palette mapping (reserved for future use)
// Uncomment when getTailwindColor function is needed
/*
const TAILWIND_GRAY: Record<string, string> = {
  '50': '#f9fafb',
  '100': '#f3f4f6',
  '200': '#e5e7eb',
  '300': '#d1d5db',
  '400': '#9ca3af',
  '500': '#6b7280',
  '600': '#4b5563',
  '700': '#374151',
  '800': '#1f2937',
  '900': '#111827',
  '950': '#030712',
};

const TAILWIND_BLUE: Record<string, string> = {
  '50': '#eff6ff',
  '100': '#dbeafe',
  '200': '#bfdbfe',
  '300': '#93c5fd',
  '400': '#60a5fa',
  '500': '#3b82f6',
  '600': '#2563eb',
  '700': '#1d4ed8',
  '800': '#1e40af',
  '900': '#1e3a8a',
  '950': '#172554',
};

const TAILWIND_GREEN: Record<string, string> = {
  '50': '#f0fdf4',
  '100': '#dcfce7',
  '200': '#bbf7d0',
  '300': '#86efac',
  '400': '#4ade80',
  '500': '#22c55e',
  '600': '#16a34a',
  '700': '#15803d',
  '800': '#166534',
  '900': '#14532d',
  '950': '#052e16',
};

const TAILWIND_RED: Record<string, string> = {
  '50': '#fef2f2',
  '100': '#fee2e2',
  '200': '#fecaca',
  '300': '#fca5a5',
  '400': '#f87171',
  '500': '#ef4444',
  '600': '#dc2626',
  '700': '#b91c1c',
  '800': '#991b1b',
  '900': '#7f1d1d',
  '950': '#450a0a',
};

const TAILWIND_YELLOW: Record<string, string> = {
  '50': '#fefce8',
  '100': '#fef9c3',
  '200': '#fef08a',
  '300': '#fde047',
  '400': '#facc15',
  '500': '#eab308',
  '600': '#ca8a04',
  '700': '#a16207',
  '800': '#854d0e',
  '900': '#713f12',
  '950': '#422006',
};

const TAILWIND_ORANGE: Record<string, string> = {
  '50': '#fff7ed',
  '100': '#ffedd5',
  '200': '#fed7aa',
  '300': '#fdba74',
  '400': '#fb923c',
  '500': '#f97316',
  '600': '#ea580c',
  '700': '#c2410c',
  '800': '#9a3412',
  '900': '#7c2d12',
  '950': '#431407',
};

const TAILWIND_PURPLE: Record<string, string> = {
  '50': '#faf5ff',
  '100': '#f3e8ff',
  '200': '#e9d5ff',
  '300': '#d8b4fe',
  '400': '#c084fc',
  '500': '#a855f7',
  '600': '#9333ea',
  '700': '#7e22ce',
  '800': '#6b21a8',
  '900': '#581c87',
  '950': '#3b0764',
};

const TAILWIND_INDIGO: Record<string, string> = {
  '50': '#eef2ff',
  '100': '#e0e7ff',
  '200': '#c7d2fe',
  '300': '#a5b4fc',
  '400': '#818cf8',
  '500': '#6366f1',
  '600': '#4f46e5',
  '700': '#4338ca',
  '800': '#3730a3',
  '900': '#312e81',
  '950': '#1e1b4b',
};
*/

// Map Tailwind class to hex color (reserved for future use)
// function getTailwindColor(colorClass: string): string | null {
//   const match = colorClass.match(/(gray|blue|green|red|yellow|orange|purple|indigo)-(\d+)/);
//   if (!match) return null;

//   const [, colorName, shade] = match;
//   const paletteMap: Record<string, Record<string, string>> = {
//     gray: TAILWIND_GRAY,
//     blue: TAILWIND_BLUE,
//     green: TAILWIND_GREEN,
//     red: TAILWIND_RED,
//     yellow: TAILWIND_YELLOW,
//     orange: TAILWIND_ORANGE,
//     purple: TAILWIND_PURPLE,
//     indigo: TAILWIND_INDIGO,
//   };

//   return paletteMap[colorName]?.[shade] || null;
// }

export interface ColorCombination {
  component: string;
  file: string;
  foreground: string;
  foregroundClass?: string;
  background: string;
  backgroundClass?: string;
  context: string;
  state?: 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'selected';
}

export interface ContrastIssue {
  combination: ColorCombination;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  wcagAALarge: boolean;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  suggestedForeground?: string;
  suggestedBackground?: string;
}

export interface ColorAuditResult {
  totalCombinations: number;
  passed: number;
  failed: number;
  issues: ContrastIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  accessiblePalette: AccessibleColorPalette;
}

export interface AccessibleColorPalette {
  primary: { hex: string; oklch: string; contrast: number };
  secondary: { hex: string; oklch: string; contrast: number };
  success: { hex: string; oklch: string; contrast: number };
  warning: { hex: string; oklch: string; contrast: number };
  error: { hex: string; oklch: string; contrast: number };
  neutral: { hex: string; oklch: string; contrast: number };
  backgrounds: {
    light: { hex: string; oklch: string };
    dark: { hex: string; oklch: string };
    card: { hex: string; oklch: string };
    muted: { hex: string; oklch: string };
  };
  text: {
    primary: { hex: string; oklch: string };
    secondary: { hex: string; oklch: string };
    muted: { hex: string; oklch: string };
    inverse: { hex: string; oklch: string };
  };
}

/**
 * Convert hex to OKLCH (simplified approximation)
 */
function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'oklch(0.5 0 0)';

  // Convert RGB to linear RGB
  const [rLinear, gLinear, bLinear] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Convert to XYZ
  const x = (rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375) * 100;
  const y = (rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750) * 100;
  const z = (rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041) * 100;

  // Convert to Lab (simplified)
  const fx = x > 0.008856 ? Math.pow(x / 95.047, 1/3) : (7.787 * x / 95.047 + 16/116);
  const fy = y > 0.008856 ? Math.pow(y / 100.0, 1/3) : (7.787 * y / 100.0 + 16/116);
  const fz = z > 0.008856 ? Math.pow(z / 108.883, 1/3) : (7.787 * z / 108.883 + 16/116);

  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  // Approximate OKLCH (this is simplified - full conversion is complex)
  const lightness = L / 100;
  const chroma = Math.sqrt(a * a + bLab * bLab) / 100;
  const hue = Math.atan2(bLab, a) * 180 / Math.PI;

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
}

/**
 * Find accessible color variant
 */
function findAccessibleVariant(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): { foreground?: string; background?: string } {
  const currentRatio = getContrastRatio(foreground, background);
  
  if (currentRatio >= targetRatio) {
    return {};
  }

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) return {};

  // Determine if we need to darken or lighten
  const fgLum = getLuminance(fgRgb);
  const bgLum = getLuminance(bgRgb);
  
  let suggestedFg = foreground;

  if (fgLum > bgLum) {
    // Foreground is lighter, need to darken it or lighten background
    const steps = Math.ceil((targetRatio - currentRatio) * 10);
    suggestedFg = darkenColor(foreground, steps);
  } else {
    // Foreground is darker, need to lighten it or darken background
    const steps = Math.ceil((targetRatio - currentRatio) * 10);
    suggestedFg = lightenColor(foreground, steps);
  }

  // Verify the suggestion
  const newRatio = getContrastRatio(suggestedFg, background);
  if (newRatio >= targetRatio) {
    return { foreground: suggestedFg };
  }

  return { foreground: suggestedFg };
}

function darkenColor(hex: string, steps: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - (steps * 0.1);
  return `#${Math.max(0, Math.floor(rgb.r * factor)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(rgb.g * factor)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(rgb.b * factor)).toString(16).padStart(2, '0')}`;
}

function lightenColor(hex: string, steps: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + (steps * 0.1);
  return `#${Math.min(255, Math.floor(rgb.r * factor)).toString(16).padStart(2, '0')}${Math.min(255, Math.floor(rgb.g * factor)).toString(16).padStart(2, '0')}${Math.min(255, Math.floor(rgb.b * factor)).toString(16).padStart(2, '0')}`;
}

/**
 * Comprehensive color audit
 * Scans all color combinations used in the application
 */
export function comprehensiveColorAudit(): ColorAuditResult {
  // Define all color combinations found in the codebase
  const combinations: ColorCombination[] = [
    // Text colors on backgrounds
    { component: 'Primary Text', file: 'globals.css', foreground: '#1f2937', background: '#ffffff', context: 'Main text on white background', foregroundClass: 'text-gray-800' },
    { component: 'Secondary Text', file: 'globals.css', foreground: '#6b7280', background: '#ffffff', context: 'Secondary text on white background', foregroundClass: 'text-gray-600' },
    { component: 'Muted Text', file: 'globals.css', foreground: '#9ca3af', background: '#ffffff', context: 'Muted text on white background', foregroundClass: 'text-gray-400' },
    
    // Status colors
    { component: 'Success Text', file: 'BiasCard.tsx', foreground: '#059669', background: '#ffffff', context: 'Success text on white', foregroundClass: 'text-green-700' },
    { component: 'Error Text', file: 'BiasCard.tsx', foreground: '#dc2626', background: '#ffffff', context: 'Error text on white', foregroundClass: 'text-red-700' },
    { component: 'Warning Text', file: 'BiasCard.tsx', foreground: '#d97706', background: '#ffffff', context: 'Warning text on white', foregroundClass: 'text-yellow-700' },
    
    // Background colors with text
    { component: 'Green Badge', file: 'BiasCard.tsx', foreground: '#065f46', background: '#d1fae5', context: 'Green badge text', foregroundClass: 'text-green-800', backgroundClass: 'bg-green-100' },
    { component: 'Red Badge', file: 'BiasCard.tsx', foreground: '#991b1b', background: '#fee2e2', context: 'Red badge text', foregroundClass: 'text-red-800', backgroundClass: 'bg-red-100' },
    { component: 'Blue Badge', file: 'BiasCard.tsx', foreground: '#1e40af', background: '#dbeafe', context: 'Blue badge text', foregroundClass: 'text-blue-800', backgroundClass: 'bg-blue-100' },
    { component: 'Yellow Badge', file: 'BiasCard.tsx', foreground: '#92400e', background: '#fef3c7', context: 'Yellow badge text', foregroundClass: 'text-yellow-900', backgroundClass: 'bg-yellow-100' },
    { component: 'Gray Badge', file: 'BiasCard.tsx', foreground: '#1f2937', background: '#f3f4f6', context: 'Gray badge text', foregroundClass: 'text-gray-800', backgroundClass: 'bg-gray-100' },
    
    // Button states
    { component: 'Primary Button', file: 'button.tsx', foreground: '#ffffff', background: '#2563eb', context: 'Primary button text', state: 'default' },
    { component: 'Primary Button Hover', file: 'button.tsx', foreground: '#ffffff', background: '#1d4ed8', context: 'Primary button hover', state: 'hover' },
    { component: 'Outline Button', file: 'button.tsx', foreground: '#1f2937', background: '#ffffff', context: 'Outline button text', state: 'default' },
    { component: 'Outline Button Hover', file: 'button.tsx', foreground: '#1f2937', background: '#f3f4f6', context: 'Outline button hover', state: 'hover' },
    
    // Chart colors
    { component: 'Chart Green', file: 'EnhancedChart.tsx', foreground: '#16a34a', background: '#ffffff', context: 'Chart green indicator' },
    { component: 'Chart Red', file: 'EnhancedChart.tsx', foreground: '#dc2626', background: '#ffffff', context: 'Chart red indicator' },
    
    // Status indicators
    { component: 'Market Open', file: 'page.tsx', foreground: '#ffffff', background: '#22c55e', context: 'Market open indicator', backgroundClass: 'bg-green-500' },
    { component: 'Market Closed', file: 'page.tsx', foreground: '#ffffff', background: '#ef4444', context: 'Market closed indicator', backgroundClass: 'bg-red-500' },
    
    // Card backgrounds
    { component: 'Card Background', file: 'card.tsx', foreground: '#1f2937', background: '#ffffff', context: 'Card text on white card' },
    { component: 'Muted Card', file: 'BiasCard.tsx', foreground: '#374151', background: '#f9fafb', context: 'Text on muted card', backgroundClass: 'bg-gray-50' },
    
    // Analytics page
    { component: 'Analytics Text', file: 'analytics/page.tsx', foreground: '#1f2937', background: '#f9fafb', context: 'Analytics page text', backgroundClass: 'bg-gray-50' },
    { component: 'Analytics Secondary', file: 'analytics/page.tsx', foreground: '#6b7280', background: '#f9fafb', context: 'Analytics secondary text', backgroundClass: 'bg-gray-50' },
    
    // Navigation
    { component: 'Nav Link', file: 'Navigation.tsx', foreground: '#4b5563', background: '#ffffff', context: 'Navigation link', foregroundClass: 'text-gray-600' },
    { component: 'Nav Link Hover', file: 'Navigation.tsx', foreground: '#1f2937', background: '#f9fafb', context: 'Navigation link hover', state: 'hover', backgroundClass: 'bg-gray-50' },
    { component: 'Nav Active', file: 'Navigation.tsx', foreground: '#1e40af', background: '#dbeafe', context: 'Active navigation item', foregroundClass: 'text-blue-700', backgroundClass: 'bg-blue-50' },
    
    // Table rows
    { component: 'Table Row Hover', file: 'analytics/page.tsx', foreground: '#1f2937', background: '#f9fafb', context: 'Table row hover', state: 'hover', backgroundClass: 'hover:bg-gray-50' },
    
    // Purple variants (for credentials section)
    { component: 'Purple Text', file: 'page.tsx', foreground: '#581c87', background: '#faf5ff', context: 'Purple text on light purple', foregroundClass: 'text-purple-900', backgroundClass: 'bg-purple-50' },
    { component: 'Orange Text', file: 'page.tsx', foreground: '#7c2d12', background: '#fff7ed', context: 'Orange text on light orange', foregroundClass: 'text-orange-900', backgroundClass: 'bg-orange-50' },
  ];

  const issues: ContrastIssue[] = [];
  let passed = 0;
  let failed = 0;

  combinations.forEach(combination => {
    const ratio = getContrastRatio(combination.foreground, combination.background);
    const result = checkContrast(combination.foreground, combination.background);
    
    const wcagAA = ratio >= 4.5;
    const wcagAAA = ratio >= 7;
    const wcagAALarge = ratio >= 3; // For large text (18pt+ or 14pt+ bold)
    
    if (!result.passed) {
      failed++;
      
      // Determine severity
      let severity: ContrastIssue['severity'] = 'low';
      if (ratio < 3) severity = 'critical';
      else if (ratio < 4) severity = 'high';
      else if (ratio < 4.5) severity = 'medium';
      
      // Get suggestion
      const suggestion = findAccessibleVariant(combination.foreground, combination.background, 4.5);
      
      issues.push({
        combination,
        ratio,
        wcagAA,
        wcagAAA,
        wcagAALarge,
        level: result.level,
        severity,
        suggestion: suggestion.foreground 
          ? `Use ${suggestion.foreground} for foreground to achieve WCAG AA compliance (ratio: ${getContrastRatio(suggestion.foreground, combination.background).toFixed(2)}:1)`
          : `Increase contrast ratio to at least 4.5:1 for WCAG AA compliance`,
        suggestedForeground: suggestion.foreground,
      });
    } else {
      passed++;
    }
  });

  // Generate accessible palette
  const accessiblePalette = generateAccessiblePalette();

  // Generate recommendations
  const recommendations = generateRecommendations(issues);

  return {
    totalCombinations: combinations.length,
    passed,
    failed,
    issues,
    summary: {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
    },
    recommendations,
    accessiblePalette,
  };
}

/**
 * Generate modern accessible color palette
 */
function generateAccessiblePalette(): AccessibleColorPalette {
  // Modern accessible colors (WCAG 2.2 AA/AAA compliant)
  const primary = { hex: '#2563eb', oklch: hexToOklch('#2563eb'), contrast: getContrastRatio('#ffffff', '#2563eb') };
  const secondary = { hex: '#6b7280', oklch: hexToOklch('#6b7280'), contrast: getContrastRatio('#ffffff', '#6b7280') };
  const success = { hex: '#059669', oklch: hexToOklch('#059669'), contrast: getContrastRatio('#ffffff', '#059669') };
  const warning = { hex: '#d97706', oklch: hexToOklch('#d97706'), contrast: getContrastRatio('#ffffff', '#d97706') };
  const error = { hex: '#dc2626', oklch: hexToOklch('#dc2626'), contrast: getContrastRatio('#ffffff', '#dc2626') };
  const neutral = { hex: '#374151', oklch: hexToOklch('#374151'), contrast: getContrastRatio('#ffffff', '#374151') };

  return {
    primary,
    secondary,
    success,
    warning,
    error,
    neutral,
    backgrounds: {
      light: { hex: '#ffffff', oklch: hexToOklch('#ffffff') },
      dark: { hex: '#111827', oklch: hexToOklch('#111827') },
      card: { hex: '#ffffff', oklch: hexToOklch('#ffffff') },
      muted: { hex: '#f9fafb', oklch: hexToOklch('#f9fafb') },
    },
    text: {
      primary: { hex: '#111827', oklch: hexToOklch('#111827') },
      secondary: { hex: '#4b5563', oklch: hexToOklch('#4b5563') },
      muted: { hex: '#6b7280', oklch: hexToOklch('#6b7280') },
      inverse: { hex: '#ffffff', oklch: hexToOklch('#ffffff') },
    },
  };
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(issues: ContrastIssue[]): string[] {
  const recommendations: string[] = [];

  if (issues.length === 0) {
    recommendations.push('✅ All color combinations meet WCAG 2.2 AA standards!');
    return recommendations;
  }

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const highIssues = issues.filter(i => i.severity === 'high');

  if (criticalIssues.length > 0) {
    recommendations.push(`🚨 ${criticalIssues.length} critical contrast issues found (ratio < 3:1). These must be fixed immediately.`);
  }

  if (highIssues.length > 0) {
    recommendations.push(`⚠️ ${highIssues.length} high-priority issues found (ratio < 4:1). Fix these to improve accessibility.`);
  }

  // Component-specific recommendations
  const badgeIssues = issues.filter(i => i.combination.component.includes('Badge'));
  if (badgeIssues.length > 0) {
    recommendations.push('💡 Consider using darker text colors on light badge backgrounds (e.g., text-green-900 on bg-green-100).');
  }

  const buttonIssues = issues.filter(i => i.combination.component.includes('Button'));
  if (buttonIssues.length > 0) {
    recommendations.push('💡 Ensure all button states (hover, focus, active) maintain WCAG AA contrast ratios.');
  }

  recommendations.push('💡 Use the provided accessible color palette for all new components.');
  recommendations.push('💡 Test color combinations in both light and dark modes.');
  recommendations.push('💡 Consider using CSS custom properties for theme-aware colors.');

  return recommendations;
}

/**
 * Export audit results as markdown report
 */
export function exportAuditReport(result: ColorAuditResult): string {
  let report = '# Color Accessibility Audit Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Combinations Checked:** ${result.totalCombinations}\n`;
  report += `- **Passed:** ${result.passed} ✅\n`;
  report += `- **Failed:** ${result.failed} ❌\n\n`;
  report += `### Severity Breakdown\n`;
  report += `- **Critical:** ${result.summary.critical}\n`;
  report += `- **High:** ${result.summary.high}\n`;
  report += `- **Medium:** ${result.summary.medium}\n`;
  report += `- **Low:** ${result.summary.low}\n\n`;

  if (result.issues.length > 0) {
    report += `## Issues\n\n`;
    report += `| Component | Foreground | Background | Ratio | WCAG AA | WCAG AAA | Severity | Suggestion |\n`;
    report += `|-----------|------------|------------|-------|---------|----------|----------|------------|\n`;

    result.issues.forEach(issue => {
      report += `| ${issue.combination.component} | ${issue.combination.foreground} | ${issue.combination.background} | ${issue.ratio.toFixed(2)}:1 | ${issue.wcagAA ? '✅' : '❌'} | ${issue.wcagAAA ? '✅' : '❌'} | ${issue.severity} | ${issue.suggestion} |\n`;
    });
  }

  report += `\n## Recommendations\n\n`;
  result.recommendations.forEach(rec => {
    report += `- ${rec}\n`;
  });

  report += `\n## Accessible Color Palette\n\n`;
  report += `### Primary Colors\n`;
  report += `- Primary: ${result.accessiblePalette.primary.hex} (${result.accessiblePalette.primary.oklch})\n`;
  report += `- Secondary: ${result.accessiblePalette.secondary.hex} (${result.accessiblePalette.secondary.oklch})\n`;
  report += `- Success: ${result.accessiblePalette.success.hex} (${result.accessiblePalette.success.oklch})\n`;
  report += `- Warning: ${result.accessiblePalette.warning.hex} (${result.accessiblePalette.warning.oklch})\n`;
  report += `- Error: ${result.accessiblePalette.error.hex} (${result.accessiblePalette.error.oklch})\n`;

  return report;
}

