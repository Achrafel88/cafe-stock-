'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        data = { message: 'Réponse serveur invalide' };
      }

      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        console.error('Login failed:', data);
        alert('Erreur: ' + (data.message || 'Identifiants invalides'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Serveur injoignable ou erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-block p-4 rounded-2xl bg-primary-600 text-white font-black text-4xl mb-6 shadow-2xl shadow-primary-600/20 rotate-3">C</div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Admin <span className="text-primary-600">Portal</span></h1>
          <p className="text-primary-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Connectez-vous pour gérer votre stock</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 ml-4">Utilisateur</label>
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-4 bg-primary-900/50 border border-primary-800 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all placeholder:text-primary-700" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 ml-4">Mot de passe</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 bg-primary-900/50 border border-primary-800 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all placeholder:text-primary-700" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
        
        <p className="text-center text-primary-600 font-black text-[10px] uppercase tracking-[0.3em]">
          © 2024 CafeStock Pro
        </p>
      </div>
    </div>
  );
}
