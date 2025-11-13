import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditZatrudnieniePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [osoba, setOsoba] = useState<any>(null);
  const [form, setForm] = useState({
    zatrudnienieDeklaracja: '',
    zatrudnionyOd: '',
    zatrudnionyDo: '',
    zatrudnienieBezterminowe: false,
    srednioczasowyCzasPracyGodziny: '',
    srednioczasowyCzasPracyMinuty: ''
  });
  const [zatrudnienieId, setZatrudnienieId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobierz dane osoby
    api.get(`/api/Osoba/${id}`)
      .then(res => {
        setOsoba(res.data);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania danych osoby:', err);
        alert('Nie można pobrać danych osoby');
      });

    // Pobierz dane zatrudnienia
    api.get(`/api/Zatrudnienie/osoba/${id}`)
      .then(res => {
        const data = res.data;
        setZatrudnienieId(data.id);
        
        // Parsuj czas pracy
        let godziny = '';
        let minuty = '';
        if (data.srednioczasowyCzasPracy) {
          const parts = data.srednioczasowyCzasPracy.split(':');
          godziny = parts[0] || '';
          minuty = parts[1] || '';
        }

        setForm({
          zatrudnienieDeklaracja: data.zatrudnienieDeklaracja || '',
          zatrudnionyOd: data.zatrudnionyOd ? data.zatrudnionyOd.split('T')[0] : '',
          zatrudnionyDo: data.zatrudnionyDo ? data.zatrudnionyDo.split('T')[0] : '',
          zatrudnienieBezterminowe: !data.zatrudnionyDo,
          srednioczasowyCzasPracyGodziny: godziny,
          srednioczasowyCzasPracyMinuty: minuty
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania danych zatrudnienia:', err);
        // Jeśli nie ma zatrudnienia, pozwól utworzyć nowe
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      // Połącz godziny i minuty w format "HH:MM"
      const czasPracy = `${form.srednioczasowyCzasPracyGodziny || '0'}:${form.srednioczasowyCzasPracyMinuty || '0'}`;
      
      const payload = {
        osobaId: Number(id),
        zatrudnienieDeklaracja: form.zatrudnienieDeklaracja,
        zatrudnionyOd: form.zatrudnionyOd || null,
        zatrudnionyDo: form.zatrudnienieBezterminowe ? null : (form.zatrudnionyDo || null),
        srednioczasowyCzasPracy: czasPracy
      };

      if (zatrudnienieId) {
        // Aktualizuj istniejące zatrudnienie
        await api.put(`/api/Zatrudnienie/${zatrudnienieId}`, payload);
        alert('Zaktualizowano dane zatrudnienia!');
      } else {
        // Utwórz nowe zatrudnienie
        await api.post('/api/Zatrudnienie', payload);
        alert('Dodano nowe zatrudnienie!');
      }
      
      navigate(`/zatrudnienie/${id}`);
    } catch (err) {
      console.error('Błąd przy zapisywaniu:', err);
      alert('Błąd przy zapisywaniu danych.');
    }
  };

  const handleCancel = () => {
    navigate(`/zatrudnienie/${id}`);
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>
        (1) Edycja zatrudnionego personelu medycznego
      </h2>
      
      {osoba && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0.25rem 0' }}><strong>Imię:</strong> {osoba.imie}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Nazwisko:</strong> {osoba.nazwisko}</p>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Zatrudnienie:*
        </label>
        <select
          name="zatrudnienieDeklaracja"
          value={form.zatrudnienieDeklaracja}
          onChange={handleChange}
          style={{ width: '200px', padding: '8px', boxSizing: 'border-box' }}
        >
          <option value="">Wybierz...</option>
          <option value="zatrudniony">zatrudniony</option>
          <option value="deklaracja">deklaracja</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Zatrudniony od:*
        </label>
        <input
          type="date"
          name="zatrudnionyOd"
          value={form.zatrudnionyOd}
          onChange={handleChange}
          style={{ padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            name="zatrudnienieBezterminowe"
            checked={form.zatrudnienieBezterminowe}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontWeight: 'bold' }}>Zatrudnienie bezterminowe</span>
        </label>
      </div>

      {!form.zatrudnienieBezterminowe && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Zatrudniony do:
          </label>
          <input
            type="date"
            name="zatrudnionyDo"
            value={form.zatrudnionyDo}
            onChange={handleChange}
            style={{ padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Śr. miesięczny czas pracy godziny/minuty:*
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            name="srednioczasowyCzasPracyGodziny"
            value={form.srednioczasowyCzasPracyGodziny}
            onChange={handleChange}
            min="0"
            max="23"
            placeholder="0"
            style={{ width: '80px', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
          />
          <span>:</span>
          <input
            type="number"
            name="srednioczasowyCzasPracyMinuty"
            value={form.srednioczasowyCzasPracyMinuty}
            onChange={handleChange}
            min="0"
            max="59"
            placeholder="0"
            style={{ width: '80px', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
          />
        </div>
        <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
          Wpisz godziny i minuty (np. 4:00)
        </small>
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '1.5rem' }}>* pola wymagane</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
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
          onClick={handleSubmit}
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
