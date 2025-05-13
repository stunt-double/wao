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
  isActivated,
} from './core';

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
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'custom';
}

// New interface for the shadcn version of the toggle
interface WAOToggleShadcnProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'custom';
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
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
    highlightRole: highlightElementRole,
  };
};

/**
 * WAO Provider component for React applications
 */
export const WAOProvider: React.FC<WAOProviderProps> = ({ children, autoActivate = false }) => {
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
  children,
}) => {
  const { isActive, describeElement, defineInteraction } = useWAO();

  useEffect(() => {
    if (isActive) {
      // Describe the element
      describeElement(selector, description, elementType, {
        role,
        importance,
        dataContext,
      });

      // Set up interactions if provided
      interactions.forEach(interaction => {
        defineInteraction(
          selector,
          interaction.type,
          interaction.method,
          interaction.expectedOutcome,
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
    defineInteraction,
  ]);

  return <>{children}</>;
};

/**
 * WAO Toggle Button component styled with Tailwind
 */
export const WAOToggle: React.FC<WAOToggleProps> = ({
  className,
  style,
  variant = 'default',
  size = 'default',
  position = 'bottom-right',
}) => {
  const { isActive, activate, deactivate } = useWAO();

  // Position classes based on the position prop
  const positionClasses = {
    'bottom-right': 'fixed bottom-5 right-5',
    'bottom-left': 'fixed bottom-5 left-5',
    'top-right': 'fixed top-5 right-5',
    'top-left': 'fixed top-5 left-5',
    custom: '', // No position classes for custom positioning
  };

  // Get the appropriate variant color
  const getVariantClasses = () => {
    if (isActive) {
      return variant === 'default'
        ? 'bg-blue-500 hover:bg-blue-600 text-white'
        : variant === 'destructive'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : variant === 'outline'
            ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
            : variant === 'secondary'
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : variant === 'ghost'
                ? 'hover:bg-blue-50 text-blue-500'
                : variant === 'link'
                  ? 'text-blue-500 hover:underline'
                  : variant === 'success'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : '';
    } else {
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    }
  };

  // Size classes
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={`
        ${positionClasses[position]} 
        ${getVariantClasses()} 
        ${sizeClasses[size]}
        rounded-md font-medium shadow transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        z-50
        ${className || ''}
      `}
      style={style}
      onClick={() => (isActive ? deactivate() : activate())}
    >
      {isActive ? 'Deactivate Optimization' : 'Activate Optimization'}
    </button>
  );
};

/**
 * WAO Toggle Button component using shadcn UI
 * Requires shadcn Button component and cn utility from a project using shadcn UI
 */
export const WAOToggleShadcn: React.FC<WAOToggleShadcnProps> = ({
  className,
  variant = isActivated() ? 'default' : 'secondary',
  size = 'default',
  position = 'bottom-right',
  buttonProps,
}) => {
  const { isActive, activate, deactivate } = useWAO();

  // For this component to work, you need to:
  // 1. Import the Button component from your shadcn UI setup
  // 2. Import the cn utility function

  // Position classes for fixed positioning
  const positionClasses = {
    'bottom-right': 'fixed bottom-5 right-5',
    'bottom-left': 'fixed bottom-5 left-5',
    'top-right': 'fixed top-5 right-5',
    'top-left': 'fixed top-5 left-5',
    custom: '', // No position classes for custom positioning
  };

  // The component below is commented out because it requires imports from your shadcn setup
  // Uncomment and adapt it to your project when using it

  /*
  return (
    <Button
      className={cn(
        positionClasses[position],
        'z-50',
        className
      )}
      variant={isActive ? variant : 'secondary'}
      size={size}
      onClick={() => (isActive ? deactivate() : activate())}
      {...buttonProps}
    >
      {isActive ? 'Deactivate Optimization' : 'Activate Optimization'}
    </Button>
  );
  */

  // This is a placeholder implementation until the component is properly imported
  return (
    <button
      className={`
        ${positionClasses[position]}
        ${
          isActive
            ? variant === 'default'
              ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
              : variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
                : variant === 'outline'
                  ? 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
                  : variant === 'secondary'
                    ? 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80'
                    : variant === 'ghost'
                      ? 'hover:bg-accent hover:text-accent-foreground'
                      : variant === 'link'
                        ? 'text-primary underline-offset-4 hover:underline'
                        : variant === 'success'
                          ? 'bg-green-500 text-white shadow-sm hover:bg-green-600'
                          : ''
            : 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80'
        }
        ${
          size === 'default'
            ? 'h-9 px-4 py-2'
            : size === 'sm'
              ? 'h-8 rounded-md px-3 text-xs'
              : size === 'lg'
                ? 'h-10 rounded-md px-8'
                : size === 'icon'
                  ? 'h-9 w-9'
                  : ''
        }
        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        z-50
        ${className || ''}
      `}
      onClick={() => (isActive ? deactivate() : activate())}
      {...buttonProps}
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
  const { isActive, analyzeAccessibility, extractStructure } = useWAO();

  useEffect(() => {
    if (isActive && autoAnalyze) {
      // Automatically analyze page
      analyzeAccessibility();
      extractStructure();
    }
  }, [isActive, autoAnalyze, analyzeAccessibility, extractStructure]);

  if (!isActive) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex gap-2">
      <button
        onClick={analyzeAccessibility}
        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Analyze Accessibility
      </button>
      <button
        onClick={extractStructure}
        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Analyze Structure
      </button>
    </div>
  );
};
