import React, { useState } from 'react';
import api from '../services/api';

export default function AddOsobaPage() {
  const [form, setForm] = useState({
    imie: '',
    imie2: '',
    nazwisko: '',
    pesel: '',
    plecId: 1,
    dataUrodzenia: '',
    typPersoneluId: 1,
    nrPwz: '',
    numerTelefonu: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/api/Osoba', {
        ...form,
        plecId: Number(form.plecId),
        typPersoneluId: Number(form.typPersoneluId),
      });
      alert('Dodano osobę!');
    } catch (err) {
      alert('Błąd przy dodawaniu.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.3s',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontSize: '14px',
    fontWeight: '500' as const
  };

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '2rem',
          color: '#333',
          fontSize: '28px',
          fontWeight: '600',
          borderBottom: '2px solid #007bff',
          paddingBottom: '1rem'
        }}>
          Dodaj Osobę
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Imię *</label>
            <input 
              name="imie" 
              value={form.imie} 
              onChange={handleChange} 
              placeholder="Wprowadź imię" 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div>
            <label style={labelStyle}>Drugie imię</label>
            <input 
              name="imie2" 
              value={form.imie2} 
              onChange={handleChange} 
              placeholder="Wprowadź drugie imię" 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Nazwisko *</label>
          <input 
            name="nazwisko" 
            value={form.nazwisko} 
            onChange={handleChange} 
            placeholder="Wprowadź nazwisko" 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>PESEL *</label>
            <input 
              name="pesel" 
              value={form.pesel} 
              onChange={handleChange} 
              placeholder="Wprowadź PESEL" 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div>
            <label style={labelStyle}>Data urodzenia *</label>
            <input 
              name="dataUrodzenia" 
              type="date" 
              value={form.dataUrodzenia} 
              onChange={handleChange} 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Nr PWZ</label>
            <input 
              name="nrPwz" 
              value={form.nrPwz} 
              onChange={handleChange} 
              placeholder="Wprowadź numer PWZ" 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div>
            <label style={labelStyle}>Numer telefonu</label>
            <input 
              name="numerTelefonu" 
              value={form.numerTelefonu} 
              onChange={handleChange} 
              placeholder="Wprowadź numer telefonu" 
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={labelStyle}>Płeć *</label>
            <select 
              name="plecId" 
              value={form.plecId} 
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              <option value={1}>Kobieta</option>
              <option value={2}>Mężczyzna</option>
              <option value={3}>Inne</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Typ Personelu *</label>
            <select 
              name="typPersoneluId" 
              value={form.typPersoneluId} 
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              <option value={1}>Lekarz</option>
              <option value={2}>Pielęgniarka</option>
              <option value={3}>Ratownik</option>
              <option value={4}>Technik Medyczny</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSubmit}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
          >
            Zapisz osobę
          </button>
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginTop: '1.5rem', marginBottom: 0 }}>
          * Pola wymagane
        </p>
      </div>
    </div>
  );
}
