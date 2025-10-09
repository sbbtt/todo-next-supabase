'use client';
import React, { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      
      if (!res.ok) throw new Error('Failed to add todo');
      
      setNewTodo({ title: '', description: '' });
      setShowAddForm(false);
      fetchTodos(); // 목록 새로고침
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    // 즉시 UI 업데이트 (Optimistic Update)
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (!res.ok) throw new Error('Failed to update todo');
    } catch (e: any) {
      setError(e.message);
      // 에러 시 원래 상태로 복원
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, completed: completed } : todo
        )
      );
    }
  };

  const updateTodo = async (id: number) => {
    if (!editTodo.title.trim()) return;
    
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTodo)
      });
      
      if (!res.ok) throw new Error('Failed to update todo');
      
      setEditingId(null);
      setEditTodo({ title: '', description: '' });
      fetchTodos(); // 목록 새로고침
    } catch (e: any) {
      setError(e.message);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTodo({ title: todo.title, description: todo.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTodo({ title: '', description: '' });
  };

  const deleteTodo = async (id: number) => {
    if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return;
    
    // 즉시 UI에서 제거 (Optimistic Update)
    const originalTodos = todos;
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete todo');
    } catch (e: any) {
      setError(e.message);
      // 에러 시 원래 상태로 복원
      setTodos(originalTodos);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
                <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Todo
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Add Todo Form */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Todo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter todo title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTodo.description}
                      onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter description (optional)..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTodo}
                      disabled={!newTodo.title.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Add Todo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Todo List */}
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
                <p className="text-gray-500">Start by adding your first task!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map(({ id, title, description, completed }) => (
                  <div
                    key={id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {editingId === id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={editTodo.title}
                            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter todo title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editTodo.description}
                            onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Enter description (optional)..."
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateTodo(id)}
                            disabled={!editTodo.title.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <button
                            onClick={() => toggleTodo(id, completed)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              completed
                                ? 'bg-green-500 border-green-500 hover:bg-green-600'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {completed && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-medium ${
                              completed ? 'text-green-800 line-through' : 'text-gray-900'
                            }`}
                          >
                            {title}
                          </h3>
                          {description && (
                            <p
                              className={`mt-1 text-sm ${
                                completed ? 'text-green-600' : 'text-gray-600'
                              }`}
                            >
                              {description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-3 flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {completed ? 'Completed' : 'Pending'}
                          </span>
                          <button
                            onClick={() => startEdit({ id, title, description, completed, created_at: '', updated_at: '' })}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                            title="Edit todo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTodo(id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete todo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
