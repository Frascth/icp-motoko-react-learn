import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE, Todo } from 'declarations/todo/todo.did';
import { canisterId, createActor } from 'declarations/todo';

export const Route = createFileRoute('/todo')({
  component: TodoComponent,
})

function TodoComponent() {
  const { authClient, principal, isAuthenticated, login } = useAuth();

  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | undefined>();

  const [todos, setTodos] = useState<Todo[]>([]);

  const [content, setContent] = useState<string>("");

  const addTodo = async () => {
    if (!actor) {
      return;
    }

    const todos = await actor.add(content);

    setTodos(todos);
  };

  const fetchTodos = async () => {
    if (!actor) {
      return;
    }

    const todos = await actor.getTodos();

    setTodos(todos);
  };

  useEffect(() => {
    if (!isAuthenticated || !authClient) {
      return;
    }
    const identity = authClient.getIdentity();

    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });

    setActor(actor);

    fetchTodos();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div>
        <div>Unauthenticated</div>
        <button type="button" onClick={login} className="border px-4 py-2">Login</button>
      </div>
    );
  }

  const todoList = todos.map(todo => {
    const stringId = todo.id.toString();

    return (
      <li key={stringId}>
        <p>id: {stringId}</p>
        <p>completedAt: {todo.completedAt ?? '-'}</p>
        <p>content: {todo.content}</p>
      </li>
    )

  });

  return (
    <div>
      <div className="p-2">{principal} todo: </div>
      <ul>{todoList}</ul>
      <div className="space-x-4 mt-8">
        <label htmlFor="contentInput">Content:</label>
        <input onChange={(e) => setContent(e.target.value)} id="contentInput" type="text" className="px-4 py-2 border" placeholder="Masukan konten" />
        <button type='button' onClick={addTodo} className="px-4 py-2 border">Add</button>
      </div>
    </div>
  )
}