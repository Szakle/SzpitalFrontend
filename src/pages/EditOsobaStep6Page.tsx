import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep6Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [doswiadczenia, setDoswiadczenia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kod: '',
    nazwa: '',
    zaswiadczenie: ''
  });
  
  const [options, setOptions] = useState({
    kody: [] as string[],
    nazwy: [] as string[],
    zaswiadczenia: [] as string[]
  });

  const loadDoswiadczenia = () => {
    console.log('Ładowanie doświadczeń dla osoby ID:', id);
    api.get(`/api/DoswiadczenieZawodowe/osoba/${id}`)
      .then(res => {
        console.log('Pobrane doświadczenia:', res.data);
        setDoswiadczenia(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania doświadczenia:', err);
        setLoading(false);
      });
  };

  const loadOptions = async () => {
    try {
      const [kodyRes, nazwyRes, zaswiadczeniaRes] = await Promise.all([
        api.get('/api/DoswiadczenieZawodowe/options/kod'),
        api.get('/api/DoswiadczenieZawodowe/options/nazwa'),
        api.get('/api/DoswiadczenieZawodowe/options/zaswiadczenie')
      ]);

      console.log('Załadowano opcje:', {
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        zaswiadczenia: zaswiadczeniaRes.data
      });

      setOptions({
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        zaswiadczenia: zaswiadczeniaRes.data
      });
    } catch (err) {
      console.error('Błąd podczas pobierania opcji:', err);
    }
  };

  useEffect(() => {
    loadDoswiadczenia();
    loadOptions();
  }, [id]);

  const handleAdd = () => {
    console.log('Kliknięto przycisk Dodaj - otwieranie modala');
    setEditingId(null);
    setFormData({ kod: '', nazwa: '', zaswiadczenie: '' });
    setShowModal(true);
  };

  const handleEdit = (doswiadczenie: any) => {
    setEditingId(doswiadczenie.id);
    setFormData({
      kod: doswiadczenie.kod || '',
      nazwa: doswiadczenie.nazwa || '',
      zaswiadczenie: doswiadczenie.zaswiadczenie || ''
    });
    setShowModal(true);
  };

  const handleDelete = (delId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to doświadczenie?')) return;
    api.delete(`/api/DoswiadczenieZawodowe/${delId}`)
      .then(() => {
        loadDoswiadczenia();
      })
      .catch(err => {
        console.error('Błąd podczas usuwania doświadczenia:', err);
        alert('Wystąpił błąd podczas usuwania doświadczenia');
      });
  };

  const handleModalSubmit = () => {
    const payload = {
      ...formData,
      osobaId: Number(id)
    };

    console.log('Wysyłane dane:', payload);

    const request = editingId
      ? api.put(`/api/DoswiadczenieZawodowe/${editingId}`, { ...payload, id: editingId })
      : api.post('/api/DoswiadczenieZawodowe', payload);

    request
      .then((response) => {
        console.log('Odpowiedź z serwera:', response.data);
        setShowModal(false);
        alert(editingId ? 'Doświadczenie zostało zaktualizowane' : 'Doświadczenie zostało dodane');
        loadDoswiadczenia();
        loadOptions();
      })
      .catch(err => {
        console.error('Błąd podczas zapisywania doświadczenia:', err);
        console.error('Szczegóły błędu:', err.response?.data);
        alert('Wystąpił błąd podczas zapisywania doświadczenia');
      });
  };

  const handleBack = () => {
    navigate(`/edytuj-osobe-step5/${id}`, { state: location.state });
  };

  const handleNext = () => {
    navigate(`/edytuj-osobe-step7/${id}`, { state: location.state });
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
        Edycja danych osoby personelu - Doświadczenie zawodowe
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={handleAdd}
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

      {doswiadczenia.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b8d4f7' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', width: '50px' }}>Lp.</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kod</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Nazwa</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Zaświadczenie</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Typ zmian</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {doswiadczenia.map((d, index) => (
              <tr key={d.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.kod || ''}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {d.nazwa || ''}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{d.zaswiadczenie || ''}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>bez zmian</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(d)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', marginRight: '10px' }}>edytuj</button>
                  <button onClick={() => handleDelete(d.id)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>usuń</button>
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#0044cc' }}>
              {editingId ? 'Edytuj doświadczenie zawodowe' : 'Dodaj doświadczenie zawodowe'}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Kod:
              </label>
              <input
                list="kod-list"
                type="text"
                value={formData.kod}
                onChange={(e) => setFormData({ ...formData, kod: e.target.value })}
                onClick={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.showPicker) input.showPicker();
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <datalist id="kod-list">
                {options.kody.map((k, idx) => (
                  <option key={idx} value={k} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Nazwa:
              </label>
              <input
                list="nazwa-list"
                type="text"
                value={formData.nazwa}
                onChange={(e) => setFormData({ ...formData, nazwa: e.target.value })}
                onClick={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.showPicker) input.showPicker();
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <datalist id="nazwa-list">
                {options.nazwy.map((n, idx) => (
                  <option key={idx} value={n} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Zaświadczenie:
              </label>
              <input
                list="zaswiadczenie-list"
                type="text"
                value={formData.zaswiadczenie}
                onChange={(e) => setFormData({ ...formData, zaswiadczenie: e.target.value })}
                onClick={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.showPicker) input.showPicker();
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <datalist id="zaswiadczenie-list">
                {options.zaswiadczenia.map((z, idx) => (
                  <option key={idx} value={z} />
                ))}
              </datalist>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
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
                onClick={handleModalSubmit}
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
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
