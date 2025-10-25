'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';


export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable ||
        (e.target as HTMLElement).getAttribute('role') === 'textbox'
      ) {
        return;
      }

      const shortcuts: Record<string, () => void> = {
        // Navigation
        'g h': () => router.push('/'),
        'g i': () => router.push('/indices'),
        'g s': () => router.push('/sectors'),
        'g t': () => router.push('/stocks'),
        'g n': () => router.push('/news'),
        'g c': () => router.push('/settings'),
        
        // Quick actions (from dashboard)
        'r': () => {
          if (pathname === '/') {
            // Find and trigger refresh button if available
            const refreshButton = document.querySelector('[aria-label*="refresh" i]') as HTMLButtonElement;
            if (refreshButton && !refreshButton.disabled) {
              refreshButton.click();
            } else {
              window.location.reload();
            }
          }
        },
        
        // Focus management
        'Tab': () => {
          // Enhanced tab navigation with skip links
          // This will be handled by browser's default tab order
        },
        
        // Skip to main content
        's': () => {
          const mainContent = document.querySelector('main, [role="main"]');
          if (mainContent) {
            (mainContent as HTMLElement).focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
          }
        },
        
        // Help
        '?': () => {
          const modal = document.getElementById('shortcuts-modal');
          if (modal) {
            modal.classList.remove('hidden');
            // Focus the modal for screen readers
            const modalContent = modal.querySelector('[role="dialog"]') as HTMLElement;
            if (modalContent) {
              modalContent.focus();
            }
          }
        },
        
        // Close modals
        'Escape': () => {
          const modals = document.querySelectorAll('[role="dialog"]');
          modals.forEach(modal => {
            if (modal instanceof HTMLElement) {
              modal.classList.add('hidden');
            }
          });
          
          // Return focus to the element that opened the modal
          const lastFocusedElement = document.querySelector('[data-last-focused]') as HTMLElement;
          if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement.removeAttribute('data-last-focused');
          }
        },
      };

      // Handle key combinations
      const key = e.key;
      if (key === 'g') {
        // Set up for next key press
        const timeout = setTimeout(() => {
          // Handle single 'g' or '?' press
          if (key === 'g' || key === '?') {
            shortcuts[key]?.();
          }
        }, 500);

        // Track 'g' followed by another key
        const handleSecondKey = (e2: KeyboardEvent) => {
          clearTimeout(timeout);
          const combo = `g ${e2.key.toLowerCase()}`;
          shortcuts[combo]?.();
          document.removeEventListener('keydown', handleSecondKey);
        };

        document.addEventListener('keydown', handleSecondKey, { once: true });
      } else if (shortcuts[key]) {
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, pathname]);

  return null;
}

// Keyboard Shortcuts Help Modal
export function ShortcutsHelp() {
  return (
    <div 
      id="shortcuts-modal" 
      className="hidden fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      aria-describedby="shortcuts-description"
    >
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => {
          const modal = document.getElementById('shortcuts-modal');
          if (modal) modal.classList.add('hidden');
        }}
        aria-hidden="true"
      />
      
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-slide-up"
        role="document"
        tabIndex={-1}
      >
        <h2 id="shortcuts-title" className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
        <p id="shortcuts-description" className="text-gray-600 mb-6">
          Use these keyboard shortcuts to navigate and interact with the application more efficiently.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Navigation</h3>
            <div className="space-y-2 text-sm" role="list" aria-label="Navigation shortcuts">
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to Dashboard</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then h">g h</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to Indices</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then i">g i</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to Sectors</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then s">g s</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to Stocks</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then t">g t</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to News</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then n">g n</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Go to Settings</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press g then c">g c</kbd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="space-y-2 text-sm" role="list" aria-label="Action shortcuts">
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Refresh</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press r">r</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Skip to main content</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press s">s</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press question mark">?</kbd>
              </div>
              <div className="flex justify-between" role="listitem">
                <span className="text-gray-600">Close modal</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded" aria-label="Press Escape">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            const modal = document.getElementById('shortcuts-modal');
            if (modal) modal.classList.add('hidden');
          }}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close keyboard shortcuts help"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
