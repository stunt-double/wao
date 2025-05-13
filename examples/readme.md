# WAO Examples

This directory contains example applications showcasing how to use WAO in different contexts.

## React Todo App Example

This example demonstrates a simple Todo app before and after WAO integration. It showcases how WAO transforms a standard React application into an LLM-optimized interface.

### Features Demonstrated:
- Basic WAO integration with React
- Visual element descriptions
- Interaction mapping
- Semantic structure analysis
- Data flow visualization
- Toggle functionality between regular and WAO-enhanced views

### Getting Started:
```bash
cd react-todo-app
npm install
npm run dev
```

The app will be running at http://localhost:5173

### Deployment to Cloudflare Pages:
The example is configured to be easily deployed to Cloudflare Pages. Just connect your GitHub repository to Cloudflare Pages with these settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: None needed

This example is fully compatible with Cloudflare Pages and demonstrates best practices for production deployment.
