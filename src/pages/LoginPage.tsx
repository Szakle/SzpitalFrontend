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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Logowanie</h2>
      <div>
        <input
          type="text"
          name="username"
          placeholder="Nazwa użytkownika"
          value={form.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSubmit}>Zaloguj</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
