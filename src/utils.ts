// utils.ts - Helper functions (pure functions)
export const logMessage = (message: string): void => {
  console.log(`LLM Optimization Library: ${message}`);
}

export const createDOMComment = (message: string): Comment => {
  return document.createComment(message);
};

