// types.ts - Define data structures for clarity and type safety
export interface ElementDescription {
  selector: string; // CSS selector of the element
  description: string; // Textual description for the LLM
  originalHTML?: string; // Original HTML content for reverting
  role?: string; // Semantic role of the element (e.g., "navigation", "button", "form")
  importance?: 'primary' | 'secondary' | 'tertiary'; // Importance level
  dataContext?: string; // Data context or purpose
}

export interface InteractionMapping {
  elementSelector: string;
  interactionType: 'click' | 'hover' | 'focus';
  methodName: string; // Name of the function to call
  expectedOutcome?: string; // Description of what happens when interaction occurs
}

export interface PageStructure {
  title: string;
  mainContent: string; // Selector for main content
  navigation: string[]; // Selectors for navigation elements
  footer?: string; // Selector for footer
  sidebar?: string[]; // Selectors for sidebars
  headerLevel?: number; // Current heading level in hierarchy
}

export type PageState = {
    originalDOM: HTMLElement; // Store original DOM for reverting.
    optimizedElements: ElementDescription[];
    interactionMappings: InteractionMapping[];
    isActive: boolean;
    pageStructure?: PageStructure; // Overall page structure
    dataFlows?: DataFlow[]; // Data flows on the page
    accessibility?: AccessibilityInfo; // Accessibility information
};

export interface DataFlow {
  source: string; // Source element selector
  destination: string; // Destination element selector
  dataType: string; // Type of data being transferred
  description: string; // Description of the data flow
}

export interface AccessibilityInfo {
  ariaLabels: {[selector: string]: string}; // Map of element selectors to their ARIA labels
  tabOrder: string[]; // Selectors in tab navigation order
  colorContrast: {[selector: string]: string}; // Color contrast issues
}

// Extend Window interface to include WAO API
declare global {
  interface Window {
    WAO: {
      activateOptimizer: (domElement: HTMLElement) => void;
      deactivateOptimizer: () => void;
      describeElementVisually: (selector: string, description: string, elementType: string) => void;
      defineInteraction: (elementSelector: string, interactionType: 'click' | 'hover' | 'focus', methodName: string) => void;
      isActivated: () => boolean;
      describePage: (pageInfo: Partial<PageStructure>) => void;
      describeDataFlow: (flow: DataFlow) => void;
      analyzeAccessibility: () => void;
      extractSemanticStructure: () => void;
      highlightElementRole: (selector: string, role: string) => void;
    };
  }
}
