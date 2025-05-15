'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert('User created! Please login');
        window.location.href = '/auth/login';
      } else {
        const error = await res.text();
        alert(error.startsWith('{') ? JSON.parse(error).error : error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Connection error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">Crear usuario</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          className="border rounded px-4 py-2 w-full"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border rounded px-4 py-2 w-full"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full box-border"
        >
          Registrarse
        </button>
      </form>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => window.location.href = '/auth/login'}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full box-border"
        >
          LogIn
        </button>
      </div>
    </div>
  );
}