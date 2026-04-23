'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/dashboard');
      } else {
        console.error('Login failed:', data);
        alert('Erreur: ' + (data.message || 'Identifiants invalides'));
      }
    } catch (err) {
      console.error(err);
      alert('Serveur injoignable');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 p-6">
      <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h2 className="text-foreground font-bold text-xl">Login Admin</h2>
        <input type="text" placeholder="Username" className="w-full p-3 rounded  text-foreground" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 rounded  text-foreground" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-primary-600 text-white p-3 rounded font-bold">Connexion</button>
      </form>
    </div>
  );
}
