import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep5Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [kompetencje, setKompetencje] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/KompetencjeUmiejetnosci/osoba/${id}`)
      .then(res => {
        setKompetencje(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania kompetencji:', err);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(`/edytuj-osobe-step4/${id}`, { state: location.state });
  };

  const handleNext = () => {
    navigate(`/edytuj-osobe-step6/${id}`, { state: location.state });
  };

  const handleCancel = () => {
    navigate('/osoby');
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#0044cc', marginBottom: '1.5rem' }}>
        Edycja danych osoby personelu - Kompetencje i umiejętności
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

      {kompetencje.length > 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', marginBottom: '1.5rem' }}>
          Brak danych
        </div>
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
