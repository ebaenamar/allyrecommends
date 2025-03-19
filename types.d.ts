// Global type declarations to fix TypeScript errors

declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module '@ai-sdk/react' {
  export const useChat: any;
  export const useCompletion: any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'classnames' {
  const classNames: (...args: any[]) => string;
  export default classNames;
}
