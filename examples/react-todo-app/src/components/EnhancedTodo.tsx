import { useState, useEffect } from 'react';
import { WAOElement, useWAO } from '@stdbl/wao/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function EnhancedTodo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const { isActive, describeElement, defineInteraction, describePage } = useWAO();

  // Set up WAO descriptions once when component mounts
  useEffect(() => {
    if (isActive) {
      // Describe the page structure
      describePage({
        title: 'Todo Application',
        mainContent: '#todo-container',
        footer: null,
        sidebar: null,
      });

      // Describe the todo input interactions
      describeElement('#todo-input', 'Text input field for entering new todo items', 'input', {
        role: 'text-input',
        importance: 'primary',
        dataContext: 'Creates new todo items when text is entered and Add button is clicked',
      });

      defineInteraction(
        '#add-button',
        'click',
        'addTodo',
        'Creates a new todo item with the text from the input field',
      );

      // Describe the todo list
      describeElement('#todo-list', 'List of todo items with complete and delete actions', 'list', {
        role: 'display-container',
        importance: 'primary',
        dataContext: 'Contains all current todo items and their status',
      });
    }
  }, [isActive, describeElement, defineInteraction, describePage]);

  const addTodo = () => {
    if (input.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <Card className="todo-container" id="todo-container">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <WAOElement
          selector="#todo-input-container"
          description="Input control area for creating new todo items"
          elementType="form-group"
          role="input-group"
          importance="primary"
        >
          <div className="flex space-x-2 mb-4" id="todo-input-container">
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              id="todo-input"
              className="flex-1"
            />
            <WAOElement
              selector="#add-button"
              description="Button to add new todo items"
              elementType="button"
              role="action-button"
              importance="primary"
              interactions={[
                {
                  type: 'click',
                  method: 'addTodo',
                  expectedOutcome: 'Creates a new todo item and clears the input field',
                },
              ]}
            >
              <Button onClick={addTodo} id="add-button">
                Add
              </Button>
            </WAOElement>
          </div>
        </WAOElement>

        <WAOElement
          selector="#todo-list"
          description="Container for all todo items"
          elementType="list"
          role="data-display"
          importance="primary"
        >
          <div className="space-y-3" id="todo-list">
            {todos.length === 0 ? (
              <WAOElement
                selector="#empty-state"
                description="Empty state message when no todos exist"
                elementType="text"
                role="information"
                importance="secondary"
              >
                <p className="text-center text-muted-foreground" id="empty-state">
                  No tasks yet. Add one above!
                </p>
              </WAOElement>
            ) : (
              todos.map(todo => (
                <WAOElement
                  key={todo.id}
                  selector={`#todo-${todo.id}`}
                  description={`Todo item: ${todo.text}`}
                  elementType="list-item"
                  role="data-item"
                  importance="secondary"
                  dataFlow={[
                    {
                      source: '#todo-input',
                      destination: `#todo-${todo.id}`,
                      dataType: 'text',
                      description: 'Text from input becomes todo item',
                    },
                  ]}
                >
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      todo.completed ? 'bg-muted/50' : 'bg-card'
                    }`}
                    id={`todo-${todo.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <WAOElement
                        selector={`#checkbox-${todo.id}`}
                        description="Checkbox to mark todo as complete or incomplete"
                        elementType="checkbox"
                        role="action-control"
                        importance="secondary"
                        interactions={[
                          {
                            type: 'change',
                            method: 'toggleComplete',
                            expectedOutcome: 'Toggles the completed status of the todo item',
                          },
                        ]}
                      >
                        <Checkbox
                          id={`checkbox-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => toggleComplete(todo.id)}
                        />
                      </WAOElement>
                      <span
                        className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <WAOElement
                      selector={`#delete-${todo.id}`}
                      description="Button to remove todo item from the list"
                      elementType="button"
                      role="action-button"
                      importance="danger"
                      interactions={[
                        {
                          type: 'click',
                          method: 'deleteTodo',
                          expectedOutcome: 'Removes the todo item from the list',
                        },
                      ]}
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        id={`delete-${todo.id}`}
                      >
                        Delete
                      </Button>
                    </WAOElement>
                  </div>
                </WAOElement>
              ))
            )}
          </div>
        </WAOElement>
      </CardContent>
    </Card>
  );
}

export default EnhancedTodo;
