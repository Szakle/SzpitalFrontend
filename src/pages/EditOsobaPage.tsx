import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/Osoba/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          imie: data.imie || '',
          imie2: data.imie2 || '',
          nazwisko: data.nazwisko || '',
          pesel: data.pesel || '',
          plecId: data.plecId || 1,
          dataUrodzenia: data.dataUrodzenia ? data.dataUrodzenia.split('T')[0] : '',
          typPersoneluId: data.typPersoneluId || 1,
          nrPwz: data.nrPwz || '',
          numerTelefonu: data.numerTelefonu || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania danych osoby:', err);
        alert('Nie można pobrać danych osoby');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    // Przejdź do następnej strony (Wykształcenie)
    navigate(`/edytuj-osobe-step2/${id}`, { state: form });
  };

  const handleCancel = () => {
    navigate('/osoby');
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edycja danych osoby personelu</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Dane podstawowe:
        </label>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>PESEL:</label>
          <input 
            name="pesel" 
            value={form.pesel} 
            onChange={handleChange} 
            placeholder="PESEL"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Imię:</label>
          <input 
            name="imie" 
            value={form.imie} 
            onChange={handleChange} 
            placeholder="Imię"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Drugie imię:</label>
          <input 
            name="imie2" 
            value={form.imie2} 
            onChange={handleChange} 
            placeholder="Drugie imię"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nazwisko:</label>
          <input 
            name="nazwisko" 
            value={form.nazwisko} 
            onChange={handleChange} 
            placeholder="Nazwisko"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Numer telefonu:</label>
          <input 
            name="numerTelefonu" 
            value={form.numerTelefonu} 
            onChange={handleChange} 
            placeholder="Numer telefonu"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Adres e-mail:</label>
          <input 
            type="text" 
            placeholder="–"
            disabled
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#f0f0f0' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Anuluj
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Dalej →
        </button>
      </div>
    </div>
  );
}
