import { useState } from 'react';
import { WAOProvider, WAOToggle, WAOPage, WAOInspector } from '@stdbl/wao/react';
import EnhancedTodo from './components/EnhancedTodo';
import { Button } from './components/ui/button';

function App() {
  const [showInspector, setShowInspector] = useState(false);
  const [analyze, setAnalyze] = useState(false);

  return (
    <WAOProvider autoActivate={false}>
      <WAOPage
        structure={{
          title: 'WAO Todo Demo',
          mainContent: '.todo-app',
          footer: '.controls-toolbar',
        }}
      >
        <div className="todo-app min-h-screen bg-background flex flex-col items-center p-8">
          <h1 className="text-3xl font-bold mb-6">WAO Todo Demo</h1>

          <div className="max-w-xl w-full mx-auto">
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Todo App</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Use the floating toolbar to control WAO features.
              </p>
              <div className="h-px bg-border my-4"></div>
              <EnhancedTodo />

              {showInspector && <WAOInspector autoAnalyze={analyze} />}
            </div>
          </div>

          <div
            className="controls-toolbar fixed bottom-5 left-1/2 transform -translate-x-1/2 
                         bg-background/80 backdrop-blur-md border border-border rounded-lg 
                         shadow-md p-3 flex gap-4 items-center z-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">WAO:</span>
              <WAOToggle />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowInspector(!showInspector)}
                variant={showInspector ? 'secondary' : 'outline'}
                size="sm"
              >
                {showInspector ? 'Hide Inspector' : 'Show Inspector'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAnalyze(!analyze)}
                variant={analyze ? 'secondary' : 'outline'}
                size="sm"
                disabled={!showInspector}
                className={!showInspector ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {analyze ? 'Stop Analysis' : 'Start Analysis'}
              </Button>
            </div>
          </div>
        </div>
      </WAOPage>
    </WAOProvider>
  );
}

export default App;
