import React, { useEffect, useState, Fragment } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { 
  activateOptimizer, 
  deactivateOptimizer, 
  describeElementVisually, 
  defineInteraction,
  describePage,
  describeDataFlow,
  analyzeAccessibility,
  extractSemanticStructure,
  highlightElementRole,
  isActivated
} from './core.js';

// Define types for props and interfaces
interface InteractionType {
  type: 'click' | 'hover' | 'focus';
  method: string;
  expectedOutcome?: string;
}

interface WAOHookReturn {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  describeElement: typeof describeElementVisually;
  defineInteraction: typeof defineInteraction;
  describePage: typeof describePage;
  describeDataFlow: typeof describeDataFlow;
  analyzeAccessibility: typeof analyzeAccessibility;
  extractStructure: typeof extractSemanticStructure;
  highlightRole: typeof highlightElementRole;
}

interface WAOProviderProps {
  children: ReactNode;
  autoActivate?: boolean;
}

interface WAOElementProps {
  selector: string;
  description: string;
  elementType: string;
  role?: string;
  importance?: 'primary' | 'secondary' | 'tertiary';
  dataContext?: string;
  interactions?: InteractionType[];
  children?: ReactNode;
}

interface WAOToggleProps {
  className?: string;
  style?: CSSProperties;
}

interface WAOPageProps {
  structure: {
    title?: string;
    mainContent?: string;
    navigation?: string | string[];
    footer?: string;
    sidebar?: string | string[];
    [key: string]: any;
  };
  children?: ReactNode;
}

interface WAODataFlowProps {
  flow: {
    source: string;
    destination: string;
    dataType?: string;
    description?: string;
    [key: string]: any;
  };
}

interface WAOInspectorProps {
  autoAnalyze?: boolean;
}

/**
 * React hook to use WAO in functional components
 */
export const useWAO = (autoActivate = false): WAOHookReturn => {
  const [isActive, setIsActive] = useState<boolean>(isActivated());

  // Sync state with WAO activation state
  useEffect(() => {
    setIsActive(isActivated());
    
    // Auto activate if specified
    if (autoActivate && !isActivated()) {
      activateOptimizer(document.body);
      setIsActive(true);
    }

    return () => {};
  }, [autoActivate]);

  // Wrapper functions to update React state after WAO operations
  const activate = (): void => {
    activateOptimizer(document.body);
    setIsActive(true);
  };

  const deactivate = (): void => {
    deactivateOptimizer();
    setIsActive(false);
  };

  return {
    isActive,
    activate,
    deactivate,
    describeElement: describeElementVisually,
    defineInteraction,
    describePage,
    describeDataFlow,
    analyzeAccessibility,
    extractStructure: extractSemanticStructure,
    highlightRole: highlightElementRole
  };
};

/**
 * WAO Provider component for React applications
 */
export const WAOProvider: React.FC<WAOProviderProps> = ({ 
  children, 
  autoActivate = false 
}) => {
  const { isActive, activate } = useWAO(autoActivate);

  useEffect(() => {
    if (autoActivate && !isActive) {
      activate();
    }
  }, [autoActivate, isActive, activate]);

  return <>{children}</>;
};

/**
 * WAO Element component to describe UI elements
 */
export const WAOElement: React.FC<WAOElementProps> = ({
  selector,
  description,
  elementType,
  role,
  importance,
  dataContext,
  interactions = [],
  children
}) => {
  const { isActive, describeElement, defineInteraction } = useWAO();

  useEffect(() => {
    if (isActive) {
      // Describe the element
      describeElement(selector, description, elementType, {
        role,
        importance,
        dataContext
      });

      // Set up interactions if provided
      interactions.forEach(interaction => {
        defineInteraction(
          selector,
          interaction.type,
          interaction.method,
          interaction.expectedOutcome
        );
      });
    }
  }, [
    isActive, 
    selector, 
    description, 
    elementType, 
    role, 
    importance, 
    dataContext, 
    interactions,
    describeElement,
    defineInteraction
  ]);

  return <>{children}</>;
};

/**
 * WAO Toggle Button component
 */
export const WAOToggle: React.FC<WAOToggleProps> = ({ className, style }) => {
  const { isActive, activate, deactivate } = useWAO();

  return (
    <button
      className={`wao-react-toggle ${className || ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        ...style
      }}
      onClick={() => isActive ? deactivate() : activate()}
    >
      {isActive ? 'Deactivate Optimization' : 'Activate Optimization'}
    </button>
  );
};

/**
 * WAO Page component to describe overall page structure
 */
export const WAOPage: React.FC<WAOPageProps> = ({ structure, children }) => {
  const { isActive, describePage } = useWAO();

  useEffect(() => {
    if (isActive) {
      describePage(structure);
    }
  }, [isActive, structure, describePage]);

  return <>{children}</>;
};

/**
 * WAO DataFlow component to visualize data flows
 */
export const WAODataFlow: React.FC<WAODataFlowProps> = ({ flow }) => {
  const { isActive, describeDataFlow } = useWAO();

  useEffect(() => {
    if (isActive) {
      describeDataFlow(flow);
    }
  }, [isActive, flow, describeDataFlow]);

  return null; // This component doesn't render anything directly
};

/**
 * WAO Inspector component for one-click accessibility and structure analysis
 */
export const WAOInspector: React.FC<WAOInspectorProps> = ({ autoAnalyze = false }) => {
  const { 
    isActive, 
    analyzeAccessibility, 
    extractStructure 
  } = useWAO();

  useEffect(() => {
    if (isActive && autoAnalyze) {
      // Automatically analyze page
      analyzeAccessibility();
      extractStructure();
    }
  }, [isActive, autoAnalyze, analyzeAccessibility, extractStructure]);

  if (!isActive) return null;

  return (
    <div
      className="wao-inspector-controls"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        gap: '8px'
      }}
    >
      <button
        onClick={analyzeAccessibility}
        style={{
          padding: '6px 12px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Analyze Accessibility
      </button>
      <button
        onClick={extractStructure}
        style={{
          padding: '6px 12px',
          backgroundColor: '#2ecc71',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Analyze Structure
      </button>
    </div>
  );
}; 
