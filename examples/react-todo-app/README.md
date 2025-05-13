# WAO React Todo App Example

This example demonstrates how to integrate the Web Augmentation Optimizer (WAO) with a simple React Todo application. It shows the before and after states of implementing WAO, highlighting how it transforms the UI for LLM agents.

## Features

- Simple Todo application with add, complete, and delete functionality
- Side-by-side comparison of regular React app vs. WAO-enhanced version
- Complete implementation of WAO React components
- Toggle functionality to activate/deactivate WAO enhancements
- Full semantic descriptions, interaction mapping, and data flow visualization

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:5173

## How It Works

This example consists of two main components:

1. **Standard Todo Component:** A regular React Todo implementation without any WAO enhancements
2. **Enhanced Todo Component:** The same Todo functionality with full WAO integration

### Key WAO Features Demonstrated

- **WAOProvider:** Context provider for WAO functionality
- **WAOToggle:** Button to activate/deactivate WAO on the page
- **WAOElement:** Component wrappers that add semantic meaning to UI elements
- **WAOPage:** Page-level organization and structure mapping
- **WAOInspector:** Accessibility and structure analysis tool

You can toggle between viewing the standard and enhanced versions using the buttons at the top of the page. When viewing the enhanced version, you can toggle WAO on/off to see the visual differences.

## Deployment

This example is configured for deployment to Cloudflare Pages with zero configuration. Just connect your GitHub repository to Cloudflare Pages with these settings:

- Build command: `npm run build`
- Build output directory: `dist`

## Learn More

For a full explanation of WAO's capabilities, refer to the main [WAO documentation](https://github.com/stunt-double/wao#readme). 
