import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EdytujMiejscePracyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [miejsce, setMiejsce] = useState<any>(null);
  const [osoba, setOsoba] = useState<any>(null);
  const [formData, setFormData] = useState({
    kodMiejscaUdzielaniaSwiadczen: '',
    nazwaMiejscaUdzielaniaSwiadczen: '',
    kodSpecjalnosci: '',
    nazwaSpecjalnosci: '',
    zawodSpecjalnosc: '',
    nazwaFunkcji: '',
    pracaOd: '',
    pracaDo: '',
    typHarmonogramu: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/api/MiejscePracy/${id}`)
        .then(res => {
          const data = res.data;
          setMiejsce(data);
          setFormData({
            kodMiejscaUdzielaniaSwiadczen: data.kodMiejscaUdzielaniaSwiadczen || '',
            nazwaMiejscaUdzielaniaSwiadczen: data.nazwaMiejscaUdzielaniaSwiadczen || '',
            kodSpecjalnosci: data.kodSpecjalnosci || '',
            nazwaSpecjalnosci: data.nazwaSpecjalnosci || '',
            zawodSpecjalnosc: data.zawodSpecjalnosc || '',
            nazwaFunkcji: data.nazwaFunkcji || '',
            pracaOd: data.pracaOd ? data.pracaOd.split('T')[0] : '',
            pracaDo: data.pracaDo ? data.pracaDo.split('T')[0] : '',
            typHarmonogramu: data.typHarmonogramu || ''
          });

          // Pobierz dane osoby
          return api.get(`/api/Osoba/${data.osobaId}`);
        })
        .then(res => {
          setOsoba(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Błąd podczas pobierania danych:', err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/MiejscePracy/${id}`, {
        ...miejsce,
        ...formData
      });
      alert('Miejsce pracy zostało zaktualizowane');
      navigate(`/miejsca-pracy/${miejsce.osobaId}`);
    } catch (error) {
      console.error('Błąd podczas aktualizacji miejsca pracy:', error);
      alert('Nie udało się zaktualizować miejsca pracy');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Ładowanie...</div>;
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#2c5aa0' }}>Edycja miejsca pracy</h2>

      {osoba && (
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: '0.25rem 0' }}><strong>Osoba:</strong> {osoba.imie} {osoba.imie2 ? osoba.imie2 + ' ' : ''}{osoba.nazwisko}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Kod miejsca udzielania świadczeń:
            </label>
            <input
              type="text"
              value={formData.kodMiejscaUdzielaniaSwiadczen}
              onChange={(e) => setFormData({ ...formData, kodMiejscaUdzielaniaSwiadczen: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Nazwa miejsca udzielania świadczeń:
            </label>
            <input
              type="text"
              value={formData.nazwaMiejscaUdzielaniaSwiadczen}
              onChange={(e) => setFormData({ ...formData, nazwaMiejscaUdzielaniaSwiadczen: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Kod specjalności:
            </label>
            <input
              type="text"
              value={formData.kodSpecjalnosci}
              onChange={(e) => setFormData({ ...formData, kodSpecjalnosci: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Nazwa specjalności:
            </label>
            <input
              type="text"
              value={formData.nazwaSpecjalnosci}
              onChange={(e) => setFormData({ ...formData, nazwaSpecjalnosci: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Zawód/specjalność:
            </label>
            <input
              type="text"
              value={formData.zawodSpecjalnosc}
              onChange={(e) => setFormData({ ...formData, zawodSpecjalnosc: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Nazwa funkcji:
            </label>
            <input
              type="text"
              value={formData.nazwaFunkcji}
              onChange={(e) => setFormData({ ...formData, nazwaFunkcji: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Praca od:
            </label>
            <input
              type="date"
              value={formData.pracaOd}
              onChange={(e) => setFormData({ ...formData, pracaOd: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Praca do:
            </label>
            <input
              type="date"
              value={formData.pracaDo}
              onChange={(e) => setFormData({ ...formData, pracaDo: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
              Typ harmonogramu:
            </label>
            <select
              value={formData.typHarmonogramu}
              onChange={(e) => setFormData({ ...formData, typHarmonogramu: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Wybierz typ harmonogramu</option>
              <option value="szczegółowy">szczegółowy</option>
              <option value="średniogodzinowy">średniogodzinowy</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(`/miejsca-pracy/${miejsce.osobaId}`)}
            style={{
              padding: '10px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Anuluj
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Zapisz zmiany
          </button>
        </div>
      </form>
    </div>
  );
}
