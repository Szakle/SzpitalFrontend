import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginRequest {
  username: string;
  password: string;
}

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/api/Login', form);
      if (res.status === 200) {
        onLogin();
        navigate('/dodaj-osobe');
      }
    } catch (err) {
      console.error(err);
      setError('Nieprawidłowa nazwa użytkownika lub hasło.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Logowanie
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#555',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Nazwa użytkownika
          </label>
          <input
            type="text"
            name="username"
            placeholder="Wprowadź nazwę użytkownika"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#555',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Hasło
          </label>
          <input
            type="password"
            name="password"
            placeholder="Wprowadź hasło"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <button 
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Zaloguj
        </button>

        {error && (
          <p style={{ 
            color: '#dc3545', 
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
