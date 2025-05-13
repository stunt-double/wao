// core.ts - Web Augmentation Optimizer (WAO)
import type {
  ElementDescription,
  PageState,
  InteractionMapping,
  PageStructure,
  DataFlow,
  AccessibilityInfo,
} from './types';
import { createDOMComment, logMessage } from './utils';

// Core state for the library
const pageState: PageState = {
  originalDOM: document.body, // Initial state
  optimizedElements: [],
  interactionMappings: [],
  isActive: false,
  pageStructure: undefined,
  dataFlows: [],
  accessibility: {
    ariaLabels: {},
    tabOrder: [],
    colorContrast: {},
  },
};

// CSS Styles for optimized elements
const injectStyles = (): void => {
  const styleElement = document.createElement('style');
  styleElement.id = 'wao-styles';
  styleElement.textContent = `
    .wao-optimized-element {
      border: 2px solid #3498db;
      padding: 8px;
      margin: 4px;
      background-color: #f8f9fa;
      border-radius: 4px;
      position: relative;
      display: block;
    }
    
    .wao-description {
      font-family: monospace;
      margin-bottom: 6px;
      color: #2c3e50;
      display: block;
    }
    
    .wao-tag {
      background-color: #3498db;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      font-family: monospace;
      position: absolute;
      top: -10px;
      right: 5px;
    }
    
    .wao-interaction {
      margin-top: 6px;
      font-style: italic;
      color: #e74c3c;
      font-size: 12px;
      border-top: 1px dashed #ccc;
      padding-top: 4px;
    }
    
    .wao-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 8px 16px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .wao-role {
      position: absolute;
      top: -10px;
      left: 5px;
      background-color: #27ae60;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      font-family: monospace;
    }
    
    .wao-importance-primary {
      border-color: #e74c3c !important;
      border-width: 3px !important;
    }
    
    .wao-importance-secondary {
      border-color: #f39c12 !important;
    }
    
    .wao-importance-tertiary {
      border-color: #95a5a6 !important;
      border-style: dashed !important;
    }
    
    .wao-data-flow {
      position: relative;
      border: 1px dashed #9b59b6;
      margin: 10px 0;
      padding: 8px;
      background-color: rgba(155, 89, 182, 0.1);
    }
    
    .wao-data-flow::before {
      content: attr(data-description);
      font-size: 12px;
      color: #9b59b6;
      position: absolute;
      top: -10px;
      left: 10px;
      background: white;
      padding: 0 5px;
    }
    
    .wao-page-structure {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(52, 152, 219, 0.9);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      max-height: 300px;
      overflow: auto;
    }
    
    body[data-wao-active="true"] {
      filter: grayscale(0.3);
      background-color: #f0f0f0 !important;
    }
    
    .wao-accessibility-issue {
      outline: 3px solid #c0392b !important;
      position: relative;
    }
    
    .wao-accessibility-issue::after {
      content: "⚠️";
      position: absolute;
      top: 0;
      right: 0;
      background: #c0392b;
      color: white;
      padding: 2px;
    }
  `;
  document.head.appendChild(styleElement);
};

// Inject activation instructions for the LLM Agent
const injectActivationInstructions = (): void => {
  const comment = createDOMComment(`
    LLM Agent Instructions:
    - To activate this optimization library, set 'data-wao-active="true"' on the body element
    - For visual descriptions, call 'window.WAO.describeElementVisually(selector, description, elementType)'
    - To map interactions, call 'window.WAO.defineInteraction(selector, interactionType, methodName)'
    - To describe page structure, call 'window.WAO.describePage(pageInfo)'
    - To analyze page semantics, call 'window.WAO.extractSemanticStructure()'
    - To describe data flows, call 'window.WAO.describeDataFlow(flow)'
    - To analyze accessibility, call 'window.WAO.analyzeAccessibility()'
    - To highlight element roles, call 'window.WAO.highlightElementRole(selector, role)'
    - To deactivate, call 'window.WAO.deactivateOptimizer()'
  `);
  document.body.prepend(comment);

  // Also inject a data attribute observer
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'data-wao-active') {
        const bodyElement = document.body;
        const isActive = bodyElement.getAttribute('data-wao-active') === 'true';

        if (isActive && !pageState.isActive) {
          activateOptimizer(bodyElement);
        } else if (!isActive && pageState.isActive) {
          deactivateOptimizer();
        }
      }
    });
  });

  observer.observe(document.body, { attributes: true });
};

// Check if the optimizer is activated
export const isActivated = (): boolean => {
  return pageState.isActive;
};

// Activate the optimizer
const activateOptimizer = (domElement: HTMLElement): void => {
  if (!isActivated()) {
    pageState.originalDOM = domElement.cloneNode(true) as HTMLElement;
    pageState.isActive = true;
    document.body.setAttribute('data-wao-active', 'true');
    injectStyles();
    addToggle();
    setupEventListeners();
    logMessage('Optimizer activated');
  } else {
    logMessage('Optimizer already active');
  }
};

// Deactivate and restore original DOM
const deactivateOptimizer = (): void => {
  if (pageState.isActive) {
    // Don't replace the whole body to avoid losing the script
    // Instead, revert individual optimized elements
    pageState.optimizedElements.forEach(revertElementVisuals);

    // Remove any added styles and toggles
    const styleElement = document.getElementById('wao-styles');
    if (styleElement) styleElement.remove();

    const toggleButton = document.querySelector('.wao-toggle');
    if (toggleButton) toggleButton.remove();

    // Cleanup
    document.body.removeAttribute('data-wao-active');
    removeEventListeners();
    pageState.optimizedElements = [];
    pageState.interactionMappings = [];
    pageState.isActive = false;
    logMessage('Optimizer deactivated');
  } else {
    logMessage('Optimizer is not active');
  }
};

// Define an interaction for an element
const defineInteraction = (
  elementSelector: string,
  interactionType: 'click' | 'hover' | 'focus',
  methodName: string,
  expectedOutcome?: string,
): void => {
  if (!isActivated()) return;

  const mapping: InteractionMapping = {
    elementSelector,
    interactionType,
    methodName,
    expectedOutcome,
  };

  pageState.interactionMappings.push(mapping);

  // Find any already optimized elements and add interaction information
  const element = document.querySelector(elementSelector);
  if (element) {
    const optimizedElement = element.closest('.wao-optimized-element');
    if (optimizedElement) {
      let interactionElement = optimizedElement.querySelector('.wao-interaction');
      if (!interactionElement) {
        interactionElement = document.createElement('div');
        interactionElement.className = 'wao-interaction';
        optimizedElement.appendChild(interactionElement);
      }

      const interactionText = `${interactionType} → ${methodName}`;
      interactionElement.textContent +=
        interactionText + (expectedOutcome ? ` (${expectedOutcome})` : '') + ' ';
    }
  }
};

// Handle interaction events
const handleInteraction = (event: Event): void => {
  const target = event.target as HTMLElement;

  pageState.interactionMappings.forEach(mapping => {
    const matchedElement = target.closest(mapping.elementSelector);
    if (matchedElement && mapping.interactionType === event.type) {
      logMessage(`Interaction triggered: ${mapping.methodName} on ${mapping.elementSelector}`);

      // Here you would execute the actual method
      // Safely attempt to call the method if it exists on window
      const method = window[mapping.methodName as keyof typeof window];
      if (typeof method === 'function') {
        try {
          method(matchedElement);
        } catch (error) {
          logMessage(`Error executing method ${mapping.methodName}: ${error}`);
        }
      }
    }
  });
};

// Add toggle button to UI
const addToggle = (): void => {
  // Remove existing button if present
  const existingButton = document.querySelector('.wao-toggle');
  if (existingButton) existingButton.remove();

  const toggleButton = document.createElement('button');
  toggleButton.className = 'wao-toggle';
  toggleButton.textContent = pageState.isActive
    ? 'Deactivate Optimization'
    : 'Activate Optimization';

  toggleButton.addEventListener('click', () => {
    if (pageState.isActive) {
      deactivateOptimizer();
    } else {
      activateOptimizer(document.body);
    }
    toggleButton.textContent = pageState.isActive
      ? 'Deactivate Optimization'
      : 'Activate Optimization';
  });

  document.body.appendChild(toggleButton);
};

// Setup event listeners
const setupEventListeners = (): void => {
  document.addEventListener('click', handleInteraction);
  document.addEventListener('mouseover', handleInteraction); // Use mouseover for hover
  document.addEventListener('focus', handleInteraction, true); // Capture phase for focus
};

// Remove event listeners
const removeEventListeners = (): void => {
  document.removeEventListener('click', handleInteraction);
  document.removeEventListener('mouseover', handleInteraction);
  document.removeEventListener('focus', handleInteraction, true);
};

// Visually describe an element
const describeElementVisually = (
  selector: string,
  description: string,
  elementType: string,
  options?: {
    role?: string;
    importance?: 'primary' | 'secondary' | 'tertiary';
    dataContext?: string;
  },
): void => {
  if (!isActivated()) return;

  const element = document.querySelector(selector);
  if (!element) {
    logMessage(`Element not found: ${selector}`);
    return;
  }

  // Check if already optimized
  if (element.closest('.wao-optimized-element')) {
    logMessage(`Element already optimized: ${selector}`);
    return;
  }

  // Create the wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'wao-optimized-element';
  wrapper.setAttribute('data-original-selector', selector);

  // Add importance class if specified
  if (options?.importance) {
    wrapper.classList.add(`wao-importance-${options.importance}`);
  }

  // Create description
  const descriptionElement = document.createElement('div');
  descriptionElement.className = 'wao-description';
  descriptionElement.textContent = description;

  // Add data context if specified
  if (options?.dataContext) {
    const dataContextEl = document.createElement('div');
    dataContextEl.style.fontSize = '12px';
    dataContextEl.style.fontStyle = 'italic';
    dataContextEl.textContent = `Data: ${options.dataContext}`;
    descriptionElement.appendChild(dataContextEl);
  }

  // Create tag
  const tagElement = document.createElement('span');
  tagElement.className = 'wao-tag';
  tagElement.textContent = `<${elementType}>`;

  // Create role tag if specified
  if (options?.role) {
    const roleElement = document.createElement('span');
    roleElement.className = 'wao-role';
    roleElement.textContent = options.role;
    wrapper.appendChild(roleElement);
  }

  // Assemble the wrapper
  wrapper.appendChild(tagElement);
  wrapper.appendChild(descriptionElement);

  // Replace the original element with our wrapper
  element.parentNode?.replaceChild(wrapper, element);

  // Store the optimization for potential revert
  pageState.optimizedElements.push({
    selector,
    description,
    originalHTML: element.outerHTML,
    role: options?.role,
    importance: options?.importance,
    dataContext: options?.dataContext,
  });
};

// Revert visual optimization
const revertElementVisuals = (elementDescription: ElementDescription): void => {
  const optimizedElement = document.querySelector(
    `.wao-optimized-element[data-original-selector="${elementDescription.selector}"]`,
  );

  if (optimizedElement) {
    // Create a temporary container to convert HTML string to Element
    const tempContainer = document.createElement('div');
    if (elementDescription.originalHTML) {
      tempContainer.innerHTML = elementDescription.originalHTML;
      const originalElement = tempContainer.firstElementChild;

      if (originalElement) {
        optimizedElement.parentNode?.replaceChild(originalElement, optimizedElement);
      }
    }
  }
};

// New function: Describe overall page structure
const describePage = (pageInfo: Partial<PageStructure>): void => {
  if (!isActivated()) return;

  // Store page structure
  pageState.pageStructure = {
    ...pageState.pageStructure,
    ...pageInfo,
  } as PageStructure;

  // Create or update page structure visualization
  let structureEl = document.querySelector('.wao-page-structure');

  if (!structureEl) {
    structureEl = document.createElement('div');
    structureEl.className = 'wao-page-structure';
    document.body.appendChild(structureEl);
  }

  // Build HTML content for page structure
  let structureHTML = '<h3>Page Structure</h3>';

  if (pageInfo.title) {
    structureHTML += `<div><strong>Title:</strong> ${pageInfo.title}</div>`;
  }

  if (pageInfo.mainContent) {
    structureHTML += `<div><strong>Main:</strong> ${pageInfo.mainContent}</div>`;

    // Highlight main content
    const mainEl = document.querySelector(pageInfo.mainContent);
    if (mainEl && !mainEl.classList.contains('wao-optimized-element')) {
      mainEl.setAttribute('data-wao-role', 'main-content');
      mainEl.setAttribute('style', 'border: 2px dashed #3498db !important; padding: 8px;');
    }
  }

  if (pageInfo.navigation) {
    structureHTML += `<div><strong>Navigation:</strong></div><ul>`;
    const navItems = Array.isArray(pageInfo.navigation)
      ? pageInfo.navigation
      : [pageInfo.navigation];

    navItems.forEach((nav: string) => {
      structureHTML += `<li>${nav}</li>`;

      // Highlight navigation
      const navEl = document.querySelector(nav);
      if (navEl && !navEl.classList.contains('wao-optimized-element')) {
        navEl.setAttribute('data-wao-role', 'navigation');
        navEl.setAttribute('style', 'border: 2px dashed #2ecc71 !important; padding: 4px;');
      }
    });
    structureHTML += `</ul>`;
  }

  if (pageInfo.sidebar) {
    structureHTML += `<div><strong>Sidebars:</strong></div><ul>`;
    const sidebarItems = Array.isArray(pageInfo.sidebar) ? pageInfo.sidebar : [pageInfo.sidebar];

    sidebarItems.forEach((side: string) => {
      structureHTML += `<li>${side}</li>`;

      // Highlight sidebar
      const sideEl = document.querySelector(side);
      if (sideEl && !sideEl.classList.contains('wao-optimized-element')) {
        sideEl.setAttribute('data-wao-role', 'sidebar');
        sideEl.setAttribute('style', 'border: 2px dashed #f39c12 !important; padding: 4px;');
      }
    });
    structureHTML += `</ul>`;
  }

  if (pageInfo.footer) {
    structureHTML += `<div><strong>Footer:</strong> ${pageInfo.footer}</div>`;

    // Highlight footer
    const footerEl = document.querySelector(pageInfo.footer);
    if (footerEl && !footerEl.classList.contains('wao-optimized-element')) {
      footerEl.setAttribute('data-wao-role', 'footer');
      footerEl.setAttribute('style', 'border: 2px dashed #9b59b6 !important; padding: 4px;');
    }
  }

  structureEl.innerHTML = structureHTML;
};

// New function: Describe data flows between elements
const describeDataFlow = (flow: DataFlow): void => {
  if (!isActivated()) return;

  // Store the data flow
  if (!pageState.dataFlows) {
    pageState.dataFlows = [];
  }

  pageState.dataFlows.push(flow);

  // Visualize the data flow
  const sourceEl = document.querySelector(flow.source);
  const destEl = document.querySelector(flow.destination);

  if (sourceEl && destEl) {
    // Create flow container
    const flowContainer = document.createElement('div');
    flowContainer.className = 'wao-data-flow';
    flowContainer.setAttribute('data-description', flow.description ?? '');
    flowContainer.innerHTML = `
      <div><strong>From:</strong> ${flow.source} (${flow.dataType})</div>
      <div style="text-align: center;">↓</div>
      <div><strong>To:</strong> ${flow.destination}</div>
    `;

    // Insert after destination element
    destEl.parentNode?.insertBefore(flowContainer, destEl.nextSibling);
  }
};

// New function: Analyze page for accessibility issues
const analyzeAccessibility = (): void => {
  if (!isActivated()) return;

  const accessibilityInfo: AccessibilityInfo = {
    ariaLabels: {},
    tabOrder: [],
    colorContrast: {},
  };

  // Find all interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [tabindex]',
  );

  // Analyze each element
  interactiveElements.forEach(element => {
    const elemNode = element as HTMLElement;
    const selector = getUniqueSelector(elemNode);

    // Check for ARIA labels
    const ariaLabel = elemNode.getAttribute('aria-label');
    const ariaLabelledBy = elemNode.getAttribute('aria-labelledby');

    if (!ariaLabel && !ariaLabelledBy && elemNode.tagName !== 'INPUT') {
      // Mark as accessibility issue
      elemNode.classList.add('wao-accessibility-issue');

      // Store issue
      accessibilityInfo.colorContrast[selector] = 'Missing ARIA label';
    }

    // Store existing labels
    if (ariaLabel) {
      accessibilityInfo.ariaLabels[selector] = ariaLabel;
    }

    // Build tab order
    if (
      elemNode.tabIndex >= 0 ||
      elemNode.tagName === 'A' ||
      elemNode.tagName === 'BUTTON' ||
      elemNode.tagName === 'INPUT' ||
      elemNode.tagName === 'SELECT' ||
      elemNode.tagName === 'TEXTAREA'
    ) {
      accessibilityInfo.tabOrder.push(selector);
    }
  });

  // Store accessibility info
  pageState.accessibility = accessibilityInfo;

  // Create accessibility report
  let accessibilityEl = document.querySelector('.wao-accessibility-report');

  if (!accessibilityEl) {
    accessibilityEl = document.createElement('div');
    accessibilityEl.className = 'wao-accessibility-report';
    accessibilityEl.setAttribute(
      'style',
      `
      position: fixed;
      left: 20px;
      top: 20px;
      background: rgba(44, 62, 80, 0.9);
      color: white;
      padding: 15px;
      border-radius: 4px;
      font-family: monospace;
      z-index: 10000;
      max-width: 300px;
      max-height: 300px;
      overflow: auto;
    `,
    );
    document.body.appendChild(accessibilityEl);
  }

  // Build HTML content for accessibility report
  let reportHTML = '<h3>Accessibility Report</h3>';

  // Tab order
  reportHTML += `<div><strong>Tab Order (${accessibilityInfo.tabOrder.length} elements):</strong></div><ol>`;
  accessibilityInfo.tabOrder.slice(0, 10).forEach(selector => {
    reportHTML += `<li>${selector}</li>`;
  });

  if (accessibilityInfo.tabOrder.length > 10) {
    reportHTML += `<li>... and ${accessibilityInfo.tabOrder.length - 10} more</li>`;
  }

  reportHTML += `</ol>`;

  // Issues
  const issueCount = Object.keys(accessibilityInfo.colorContrast).length;
  reportHTML += `<div><strong>Issues (${issueCount}):</strong></div>`;

  if (issueCount > 0) {
    reportHTML += `<ul>`;
    Object.entries(accessibilityInfo.colorContrast)
      .slice(0, 5)
      .forEach(([selector, issue]) => {
        reportHTML += `<li>${selector}: ${issue}</li>`;
      });

    if (issueCount > 5) {
      reportHTML += `<li>... and ${issueCount - 5} more</li>`;
    }

    reportHTML += `</ul>`;
  }

  accessibilityEl.innerHTML = reportHTML;
};

// New function: Extract semantic structure automatically
const extractSemanticStructure = (): void => {
  if (!isActivated()) return;

  const pageInfo: Partial<PageStructure> = {
    title: document.title,
    navigation: [],
    sidebar: [],
  };

  // Detect main content
  const mainContent =
    document.querySelector('main') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('#main');

  if (mainContent) {
    pageInfo.mainContent = getUniqueSelector(mainContent as HTMLElement);
  }

  // Detect navigation
  const navElements = document.querySelectorAll(
    'nav, [role="navigation"], header ul, .nav, .navbar',
  );
  navElements.forEach(nav => {
    if (Array.isArray(pageInfo.navigation)) {
      pageInfo.navigation.push(getUniqueSelector(nav as HTMLElement));
    }
  });

  // Detect footer
  const footer =
    document.querySelector('footer') ||
    document.querySelector('.footer') ||
    document.querySelector('#footer');
  if (footer) {
    pageInfo.footer = getUniqueSelector(footer as HTMLElement);
  }

  // Detect sidebars
  const sidebars = document.querySelectorAll('aside, .sidebar, [role="complementary"]');
  sidebars.forEach(sidebar => {
    if (Array.isArray(pageInfo.sidebar)) {
      pageInfo.sidebar.push(getUniqueSelector(sidebar as HTMLElement));
    }
  });

  // Apply the structure
  describePage(pageInfo);

  // Also process headings for hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent || '';
    const selector = getUniqueSelector(heading as HTMLElement);

    describeElementVisually(selector, `Heading: ${text}`, heading.tagName.toLowerCase(), {
      role: 'heading-level-' + level,
      importance: level <= 2 ? 'primary' : level <= 4 ? 'secondary' : 'tertiary',
    });
  });
};

// New function: Highlight element with its semantic role
const highlightElementRole = (selector: string, role: string): void => {
  if (!isActivated()) return;

  const element = document.querySelector(selector);
  if (!element) {
    logMessage(`Element not found: ${selector}`);
    return;
  }

  // If already optimized, add role to existing element
  const optimizedElement = element.closest('.wao-optimized-element');
  if (optimizedElement) {
    let roleElement = optimizedElement.querySelector('.wao-role');

    if (!roleElement) {
      roleElement = document.createElement('span');
      roleElement.className = 'wao-role';
      optimizedElement.appendChild(roleElement);
    }

    (roleElement as HTMLElement).textContent = role;
    return;
  }

  // Otherwise, create a minimal wrapper with just the role
  const wrapper = document.createElement('div');
  wrapper.className = 'wao-optimized-element';
  wrapper.setAttribute('data-original-selector', selector);

  const roleElement = document.createElement('span');
  roleElement.className = 'wao-role';
  roleElement.textContent = role;

  // Clone the original element as a child of the wrapper
  const clonedElement = element.cloneNode(true);

  wrapper.appendChild(roleElement);
  wrapper.appendChild(clonedElement);

  // Replace original with wrapper
  element.parentNode?.replaceChild(wrapper, element);

  // Store for reversion
  pageState.optimizedElements.push({
    selector,
    description: `Element with role: ${role}`,
    originalHTML: element.outerHTML,
    role,
  });
};

// Helper function: Generate a unique CSS selector for an element
const getUniqueSelector = (element: HTMLElement): string => {
  if (element.id) {
    return `#${element.id}`;
  }

  // Try using classes
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/);
    if (classes.length > 0) {
      const selector = `.${classes.join('.')}`;
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }

  // Fallback to tag name and position
  const sameTagElements = Array.from(document.querySelectorAll(element.tagName));
  const index = sameTagElements.indexOf(element);
  return `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`;
};

// Initialize the library
const initialize = (): void => {
  injectActivationInstructions();

  // Check if the body already has the activation attribute
  if (document.body.getAttribute('data-wao-active') === 'true') {
    activateOptimizer(document.body);
  }

  // Expose API globally
  window.WAO = {
    activateOptimizer,
    deactivateOptimizer,
    describeElementVisually,
    defineInteraction,
    isActivated,
    describePage,
    describeDataFlow,
    analyzeAccessibility,
    extractSemanticStructure,
    highlightElementRole,
  };
};

// Run initialization
initialize();

// Export public API
export {
  activateOptimizer,
  deactivateOptimizer,
  describeElementVisually,
  defineInteraction,
  revertElementVisuals,
  describePage,
  describeDataFlow,
  analyzeAccessibility,
  extractSemanticStructure,
  highlightElementRole,
};
