'use client';

import { validateAppColors } from './colorContrast';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: 'aria' | 'contrast' | 'navigation' | 'semantics' | 'keyboard';
  message: string;
  element?: string;
  suggestion?: string;
  severity: 'high' | 'medium' | 'low';
}

interface AccessibilityAuditResult {
  score: number;
  issues: AccessibilityIssue[];
  passed: boolean;
  recommendations: string[];
}

/**
 * Comprehensive accessibility audit for the application
 */
export function runAccessibilityAudit(): AccessibilityAuditResult {
  const issues: AccessibilityIssue[] = [];
  let score = 100;

  // Check for missing ARIA labels
  const elementsWithoutAriaLabels = document.querySelectorAll(
    'button:not([aria-label]):not([aria-labelledby]), [role="button"]:not([aria-label]):not([aria-labelledby])'
  );
  
  elementsWithoutAriaLabels.forEach((element, index) => {
    const textContent = element.textContent?.trim();
    if (!textContent || textContent.length === 0) {
      issues.push({
        type: 'error',
        category: 'aria',
        message: 'Interactive element missing accessible name',
        element: `Button ${index + 1}`,
        suggestion: 'Add aria-label or aria-labelledby attribute',
        severity: 'high'
      });
      score -= 10;
    }
  });

  // Check for missing alt attributes on images
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  imagesWithoutAlt.forEach((img, index) => {
    issues.push({
      type: 'error',
      category: 'aria',
      message: 'Image missing alt attribute',
      element: `Image ${index + 1}`,
      suggestion: 'Add descriptive alt text or alt="" for decorative images',
      severity: 'high'
    });
    score -= 15;
  });

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hasH1 = false;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (level === 1) hasH1 = true;
    
    if (index > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        category: 'semantics',
        message: 'Heading hierarchy skipped levels',
        element: `Heading ${index + 1}`,
        suggestion: 'Use headings in logical order (h1, h2, h3, etc.)',
        severity: 'medium'
      });
      score -= 5;
    }
    
    previousLevel = level;
  });

  if (!hasH1) {
    issues.push({
      type: 'error',
      category: 'semantics',
      message: 'Page missing h1 heading',
      element: 'Page',
      suggestion: 'Add a main h1 heading for the page',
      severity: 'high'
    });
    score -= 20;
  }

  // Check for proper form labels
  const inputsWithoutLabels = document.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby]):not([type="hidden"])'
  );
  
  inputsWithoutLabels.forEach((input, index) => {
    const id = input.getAttribute('id');
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel) {
      issues.push({
        type: 'error',
        category: 'aria',
        message: 'Form input missing label',
        element: `Input ${index + 1}`,
        suggestion: 'Add label element or aria-label attribute',
        severity: 'high'
      });
      score -= 10;
    }
  });

  // Check for keyboard navigation
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  let hasTabOrder = true;
  let previousTabIndex = -1;
  
  focusableElements.forEach((element) => {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
    if (tabIndex < previousTabIndex && tabIndex > 0) {
      hasTabOrder = false;
    }
    previousTabIndex = tabIndex;
  });

  if (!hasTabOrder) {
    issues.push({
      type: 'warning',
      category: 'keyboard',
      message: 'Tab order may be confusing',
      element: 'Page',
      suggestion: 'Ensure logical tab order for keyboard navigation',
      severity: 'medium'
    });
    score -= 5;
  }

  // Check for color contrast
  const colorValidation = validateAppColors();
  if (!colorValidation.passed) {
    colorValidation.issues.forEach((issue) => {
      issues.push({
        type: 'error',
        category: 'contrast',
        message: `Insufficient color contrast: ${issue.ratio.toFixed(2)}:1`,
        element: issue.element,
        suggestion: issue.suggestion,
        severity: 'high'
      });
      score -= 15;
    });
  }

  // Check for missing live regions
  const liveRegions = document.querySelectorAll('[aria-live]');
  if (liveRegions.length === 0) {
    issues.push({
      type: 'info',
      category: 'aria',
      message: 'No live regions found for dynamic content',
      element: 'Page',
      suggestion: 'Add aria-live regions for dynamic content updates',
      severity: 'low'
    });
    score -= 2;
  }

  // Check for proper landmark roles
  const hasMain = document.querySelector('[role="main"], main');
  const hasBanner = document.querySelector('[role="banner"], header');

  if (!hasMain) {
    issues.push({
      type: 'error',
      category: 'semantics',
      message: 'Missing main landmark',
      element: 'Page',
      suggestion: 'Add main element or role="main"',
      severity: 'high'
    });
    score -= 15;
  }

  if (!hasBanner) {
    issues.push({
      type: 'warning',
      category: 'semantics',
      message: 'Missing banner landmark',
      element: 'Page',
      suggestion: 'Add header element or role="banner"',
      severity: 'medium'
    });
    score -= 5;
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (issues.some(issue => issue.category === 'aria')) {
    recommendations.push('Improve ARIA implementation with proper labels and roles');
  }
  
  if (issues.some(issue => issue.category === 'contrast')) {
    recommendations.push('Enhance color contrast for better readability');
  }
  
  if (issues.some(issue => issue.category === 'keyboard')) {
    recommendations.push('Improve keyboard navigation and focus management');
  }
  
  if (issues.some(issue => issue.category === 'semantics')) {
    recommendations.push('Enhance semantic HTML structure');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! Your application has good accessibility practices.');
  }

  return {
    score: Math.max(0, score),
    issues,
    passed: score >= 80,
    recommendations
  };
}

/**
 * Quick accessibility check for specific elements
 */
export function checkElementAccessibility(element: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check if element has accessible name
  const hasAccessibleName = element.getAttribute('aria-label') || 
                           element.getAttribute('aria-labelledby') ||
                           element.textContent?.trim() ||
                           element.getAttribute('title');

  if (!hasAccessibleName && (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button')) {
    issues.push({
      type: 'error',
      category: 'aria',
      message: 'Button missing accessible name',
      element: element.tagName,
      suggestion: 'Add aria-label, aria-labelledby, or visible text',
      severity: 'high'
    });
  }

  // Check for proper ARIA attributes
  if (element.getAttribute('aria-expanded') && !element.getAttribute('aria-controls')) {
    issues.push({
      type: 'warning',
      category: 'aria',
      message: 'aria-expanded without aria-controls',
      element: element.tagName,
      suggestion: 'Add aria-controls to identify controlled element',
      severity: 'medium'
    });
  }

  return issues;
}

/**
 * Monitor accessibility in real-time
 */
export function startAccessibilityMonitoring(): () => void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const issues = checkElementAccessibility(element);
            
            if (issues.length > 0 && process.env.NODE_ENV === 'development') {
              console.warn('Accessibility issues detected:', issues);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'aria-labelledby', 'role', 'tabindex']
  });

  return () => observer.disconnect();
}

// Export types
export type { AccessibilityIssue, AccessibilityAuditResult };
