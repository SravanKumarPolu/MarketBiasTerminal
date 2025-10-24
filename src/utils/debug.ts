// Debug utility for conditional logging
export const debug = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      console.log(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      console.warn(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    console.error(...args); // Always log errors
  }
};
