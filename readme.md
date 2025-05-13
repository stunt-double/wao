# 🌟 WAO - Web Augmentation Optimizer

[![npm version](https://img.shields.io/npm/v/@stdbl/wao.svg)](https://www.npmjs.com/package/@stdbl/wao)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WAO!** Transform any webpage into an LLM-optimized interface

WAO (Web Augmentation Optimizer) is a lightweight JavaScript library that transforms any website into a structured, semantic representation optimized for Large Language Models (LLMs) acting as autonomous web agents.

## 🚀 Features

- **Zero-config activation** - WAO stays dormant until an LLM activates it
- **Visual optimizations** - Transforms complex visual elements into clear, readable descriptions
- **Semantic structure analysis** - Automatically identifies page regions and their purpose
- **Interaction mapping** - Documents all possible interactions and their outcomes
- **Accessibility insights** - Reveals tab order, ARIA attributes, and other a11y considerations
- **Data flow visualization** - Maps data relationships between page elements
- **Toggle between views** - Easily switch between optimized and original views
- **React integration** - First-class support for React applications

## 🧩 How It Works

WAO operates in two modes:

### 1. Inactive Mode (Default)
When first loaded, WAO simply injects activation instructions as DOM comments, waiting for an LLM to activate it:

```html
<!-- 
  LLM Agent Instructions:
  - To activate this optimization library, set 'data-wao-active="true"' on the body element
  - For visual descriptions, call 'window.WAO.describeElementVisually(selector, description, elementType)'
  - To map interactions, call 'window.WAO.defineInteraction(selector, interactionType, methodName)'
  - ...and more functions documented below
-->
```

### 2. Active Mode
Once activated, WAO transforms the page by:

- Adding borders, descriptions, and semantic tags to elements
- Creating structured visual representations of page components
- Displaying interaction possibilities
- Highlighting semantic roles and importance levels
- Analyzing and displaying accessibility information

## 📦 Installation

### NPM
```bash
npm install @stdbl/wao
```

### Yarn
```bash
yarn add @stdbl/wao
```

### pnpm
```bash
pnpm add @stdbl/wao
```

## 🔧 Usage

### Basic Implementation
Just include the script in your webpage:

```html
<!-- UMD version -->
<script src="https://unpkg.com/@stdbl/wao/dist/index.umd.js"></script>
```

That's it! WAO remains dormant until an LLM activates it.

### LLM-Friendly API

Once activated, LLMs can use these methods to better understand the page:

```javascript
// Describe an element visually
window.WAO.describeElementVisually(
  '#submit-button',
  'Primary action button that submits the form data',
  'button',
  {
    role: 'submit',
    importance: 'primary',
    dataContext: 'Submits user registration information'
  }
);

// Define possible interactions
window.WAO.defineInteraction(
  '#submit-button',
  'click',
  'submitForm',
  'Validates and sends user data to the server'
);

// Describe page structure
window.WAO.describePage({
  title: 'User Registration',
  mainContent: '#registration-form',
  navigation: ['.navbar', '.breadcrumbs'],
  footer: 'footer',
  sidebar: ['.help-sidebar']
});

// Define data flows
window.WAO.describeDataFlow({
  source: '#email-input',
  destination: '#form-validator',
  dataType: 'email string',
  description: 'Email validation flow'
});

// Other helpful methods
window.WAO.extractSemanticStructure();  // Auto-detect page structure
window.WAO.analyzeAccessibility();      // Analyze accessibility features
window.WAO.highlightElementRole('#cart-button', 'shopping-cart');
```

### React Integration 🔄

WAO provides first-class React support through components and hooks:

#### 1. Provider Setup

Wrap your app with the WAO provider:

```jsx
import { WAOProvider } from '@stdbl/wao/react';

function App() {
  return (
    <WAOProvider autoActivate={false}>
      <YourApp />
    </WAOProvider>
  );
}
```

#### 2. Using the React Hook

Access WAO functionality with the `useWAO` hook:

```jsx
import { useWAO } from '@stdbl/wao/react';

function MyComponent() {
  const { 
    isActive, 
    activate, 
    deactivate, 
    describeElement,
    analyzeAccessibility 
  } = useWAO();

  return (
    <div>
      <button onClick={activate}>
        Enable LLM Optimization
      </button>
      <button onClick={analyzeAccessibility}>
        Analyze Accessibility
      </button>
    </div>
  );
}
```

#### 3. Component-based Approach

Use WAO's React components for declarative usage:

```jsx
import { 
  WAOElement, 
  WAOToggle, 
  WAOPage, 
  WAOInspector 
} from '@stdbl/wao/react';

function ProductPage() {
  return (
    <>
      {/* Add activation toggle button */}
      <WAOToggle />
      
      {/* Define page structure */}
      <WAOPage structure={{
        title: 'Product Details',
        mainContent: '#product-details',
        navigation: ['.navbar'],
        footer: 'footer'
      }}>
        
        {/* Describe individual elements */}
        <WAOElement
          selector="#buy-now-button"
          description="Purchase button for immediate checkout"
          elementType="button"
          role="primary-action"
          importance="primary"
          interactions={[
            { type: 'click', method: 'addToCart', expectedOutcome: 'Adds item to cart and redirects to checkout' }
          ]}
        />
        
        {/* Inspector for quick accessibility/structure analysis */}
        <WAOInspector autoAnalyze={true} />
        
        {/* Your actual component content */}
        <main id="product-details">
          {/* ... */}
          <button id="buy-now-button">Buy Now</button>
        </main>
      </WAOPage>
    </>
  );
}
```

## 🎨 Visual Features

WAO enhances pages with several visual elements:

- **Element borders** - Color-coded by importance (red=primary, orange=secondary, gray=tertiary)
- **Semantic tags** - Blue tags showing the element type `<button>`
- **Role indicators** - Green tags showing the semantic role
- **Description text** - Plain-text descriptions of each element's purpose
- **Interaction hints** - Lists of possible interactions (click → methodName)
- **Data flow arrows** - Visual indicators of data relationships
- **Structured panels** - Fixed position panels showing page structure and accessibility info

## 🔄 Toggling WAO

WAO adds a toggle button to the bottom-right corner of the page, allowing easy switching between the optimized view and the original webpage.

Programmatically, you can toggle using:

```javascript
// Activate
document.body.setAttribute('data-wao-active', 'true');
// or directly
window.WAO.activateOptimizer(document.body);

// Deactivate
document.body.removeAttribute('data-wao-active');
// or directly
window.WAO.deactivateOptimizer();
```

## 📋 Advanced Configuration

### Custom Data Attributes

You can pre-configure your HTML with WAO attributes:

```html
<button 
  id="submit" 
  data-wao-description="Primary action button"
  data-wao-role="form-submit"
  data-wao-importance="primary"
  data-wao-interaction="click:submitForm"
>
  Submit
</button>
```

WAO will automatically process these attributes when activated.

## 👩‍💻 For Developers

### Project Structure
```
wao/
├── src/
│   ├── types.ts       # TypeScript interfaces
│   ├── utils.ts       # Helper functions
│   ├── core.ts        # Main library logic
│   ├── react.tsx      # React integration
│   └── index.ts       # Entry point for the library
├── dist/              # Compiled distribution files
├── package.json       # Project metadata
└── tsconfig.json      # TypeScript configuration
```

### Building from Source

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development with hot reload
npm run dev
```

### Code Quality

This project uses ESLint (`.eslintrc.cjs`) and Prettier (`.prettierrc.json`) with standardized configurations to ensure code quality and consistency:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Run all validations (lint, format check, tests)
npm run validate
```

The project is configured with:
- ESLint with TypeScript and React support
- Prettier with modern configuration
- VS Code integration for automatic formatting and linting
- CI pipeline validation via GitHub Actions

VS Code users will get automatic formatting on save and linting with the provided workspace settings.

### Publishing to NPM

This package is published to NPM under the `@stdbl` organization. To publish a new version:

1. Update the version in `package.json`
2. Run tests and validations: `pnpm validate`
3. Build the package: `pnpm build`
4. Publish: `npm publish` (requires NPM authentication)

The package includes a GitHub Actions workflow to automatically publish when a new release is created:

1. Ensure your NPM token is stored as a GitHub repository secret named `NPM_TOKEN`
2. Create a new release on GitHub
3. The workflow will automatically build and publish the package to NPM

## 🔬 Use Cases

- **LLM Web Agents** - Help autonomous agents understand and interact with web UIs
- **Accessibility Testing** - Visualize and understand a11y structures
- **UI/UX Auditing** - Analyze page structure and interaction flows
- **Web Scraping** - Easier identification of important page elements
- **Teaching Web Development** - Visualize DOM structure and semantics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ for LLMs and the humans who work with them
</p>
