// React integration for WAO
import React, { useEffect, useState, Fragment } from 'react';
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
} from './core';

/**
 * React hook to use WAO in functional components
 */
export const useWAO = (autoActivate = false) => {
  const [isActive, setIsActive] = useState(isActivated());

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
  const activate = () => {
    activateOptimizer(document.body);
    setIsActive(true);
  };

  const deactivate = () => {
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
export const WAOProvider = ({ children, autoActivate = false }) => {
  const { isActive, activate } = useWAO(autoActivate);

  useEffect(() => {
    if (autoActivate && !isActive) {
      activate();
    }
  }, [autoActivate, isActive, activate]);

  return React.createElement(Fragment, null, children);
};

/**
 * WAO Element component to describe UI elements
 */
export const WAOElement = ({
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

  return React.createElement(Fragment, null, children);
};

/**
 * WAO Toggle Button component
 */
export const WAOToggle = ({ className, style }) => {
  const { isActive, activate, deactivate } = useWAO();

  return React.createElement(
    'button',
    {
      className: `wao-react-toggle ${className || ''}`,
      style: {
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
      },
      onClick: () => isActive ? deactivate() : activate()
    },
    isActive ? 'Deactivate Optimization' : 'Activate Optimization'
  );
};

/**
 * WAO Page component to describe overall page structure
 */
export const WAOPage = ({ structure, children }) => {
  const { isActive, describePage } = useWAO();

  useEffect(() => {
    if (isActive) {
      describePage(structure);
    }
  }, [isActive, structure, describePage]);

  return React.createElement(Fragment, null, children);
};

/**
 * WAO DataFlow component to visualize data flows
 */
export const WAODataFlow = ({ flow }) => {
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
export const WAOInspector = ({ autoAnalyze = false }) => {
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

  return React.createElement(
    'div',
    {
      className: "wao-inspector-controls",
      style: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        gap: '8px'
      }
    },
    React.createElement(
      'button',
      {
        onClick: analyzeAccessibility,
        style: {
          padding: '6px 12px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      },
      'Analyze Accessibility'
    ),
    React.createElement(
      'button',
      {
        onClick: extractStructure,
        style: {
          padding: '6px 12px',
          backgroundColor: '#2ecc71',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      },
      'Analyze Structure'
    )
  );
}; 
