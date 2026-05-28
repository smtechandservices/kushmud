'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/data';
import { Icon } from '@/components/Icon';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect
    if (localStorage.getItem('access_token')) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(username, password);
      router.push('/');
    } catch (err) {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--sand)',
      padding: 24
    }}>
      <div style={{
        background: 'var(--paper)',
        borderRadius: 8,
        padding: '40px 32px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid var(--line)'
      }}>
        <div className="admin-brand" style={{justifyContent: 'center', marginBottom: 32}}>
          Kushmud<span className="dot" style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--clay)', transform:'translateY(-3px)'}}></span>
          <span className="tag" style={{marginLeft: 8}}>Admin</span>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(199, 154, 74, 0.1)',
              color: '#c79a4a',
              borderRadius: 4,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <Icon name="x" size={12} /> {error}
            </div>
          )}
          
          <div className="field-group">
            <label>Username</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="admin"
            />
          </div>
          
          <div className="field-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{marginTop: 8, padding: '14px 24px'}}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
