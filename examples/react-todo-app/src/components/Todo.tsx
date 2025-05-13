import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

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
    <Card className="todo-container">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button onClick={addTodo} id="add-button">
            Add
          </Button>
        </div>

        <div className="space-y-3" id="todo-list">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground" id="empty-state">
              No tasks yet. Add one above!
            </p>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  todo.completed ? 'bg-muted/50' : 'bg-card'
                }`}
                id={`todo-${todo.id}`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`checkbox-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                  />
                  <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  id={`delete-${todo.id}`}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Todo;
