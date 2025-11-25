import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep4Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [zawody, setZawody] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/ZawodySpecjalnosci/osoba/${id}`)
      .then(res => {
        setZawody(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania zawodów:', err);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(`/edytuj-osobe-step3/${id}`, { state: location.state });
  };

  const handleNext = () => {
    navigate(`/edytuj-osobe-step5/${id}`, { state: location.state });
  };

  const handleCancel = () => {
    navigate('/osoby');
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#0044cc', marginBottom: '1.5rem' }}>
        Edycja danych osoby personelu - Zawody/specjalności
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Dodaj
        </button>
      </div>

      {zawody.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b8d4f7' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', width: '50px' }}>Lp.</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kod</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Zawód/specjalność</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Stopień<br/>specjalizacji</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Data otwarcia specjalizacji<br/>Data uzyskania specjalizacji</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Dyplom</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Typ zmian</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {zawody.map((z, index) => (
              <tr key={z.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{z.kod || '221247'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{z.nazwa || 'LEKARZ - SPECJALISTA OKULISTYKI'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{z.stopienSpecjalizacji || 'SPECJALISTA'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <div>Otw: –</div>
                  <div>Uzy: {z.dataOtwarciaSpecjalizacji ? z.dataOtwarciaSpecjalizacji.split('T')[0] : '1993-04-07'}</div>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{z.dyplom || 'brak'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>bez zmian</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => {}} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>edycja</button>
                  <br />
                  <button onClick={() => {}} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', marginBottom: '1.5rem' }}>
          Brak danych
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', marginBottom: '1.5rem' }}>* pola wymagane</div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '8px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Anuluj
        </button>
        <button
          onClick={handleBack}
          style={{
            padding: '8px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Wstecz
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '8px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Dalej →
        </button>
      </div>
    </div>
  );
}
