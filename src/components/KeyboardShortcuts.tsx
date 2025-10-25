'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
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
            window.location.reload();
          }
        },
        
        // Help
        '?': () => {
          const modal = document.getElementById('shortcuts-modal');
          if (modal) {
            modal.classList.remove('hidden');
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
    <div id="shortcuts-modal" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) modal.classList.add('hidden');
      }} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-slide-up">
        <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Go to Dashboard</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g h</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Go to Indices</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g i</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Go to Sectors</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g s</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Go to Stocks</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g t</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Go to News</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g n</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Go to Settings</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">g c</kbd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Refresh</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">r</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">?</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Close modal</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            const modal = document.getElementById('shortcuts-modal');
            if (modal) modal.classList.add('hidden');
          }}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
