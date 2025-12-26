import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep4Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [uprawnienia, setUprawnienia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    rodzaj: '',
    npwzIdRizh: '',
    organRejestrujacy: '',
    dataUzyciaUprawnienia: ''
  });
  
  const [options, setOptions] = useState({
    rodzaje: [] as string[],
    npwz: [] as string[],
    organy: [] as string[]
  });

  const loadUprawnienia = () => {
    api.get(`/api/UprawnieniZawodowe/osoba/${id}`)
      .then(res => {
        setUprawnienia(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania uprawnień zawodowych:', err);
        setLoading(false);
      });
  };

  const loadOptions = async () => {
    try {
      const [rodzajeRes, npwzRes, organyRes] = await Promise.all([
        api.get('/api/UprawnieniZawodowe/options/rodzaj'),
        api.get('/api/UprawnieniZawodowe/options/npwz'),
        api.get('/api/UprawnieniZawodowe/options/organ')
      ]);

      console.log('Załadowano opcje:', {
        rodzaje: rodzajeRes.data,
        npwz: npwzRes.data,
        organy: organyRes.data
      });

      setOptions({
        rodzaje: rodzajeRes.data,
        npwz: npwzRes.data,
        organy: organyRes.data
      });
    } catch (err) {
      console.error('Błąd podczas pobierania opcji:', err);
    }
  };

  useEffect(() => {
    loadUprawnienia();
    loadOptions();
  }, [id]);

  useEffect(() => {
    loadUprawnienia();
    loadOptions();
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

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      rodzaj: '',
      npwzIdRizh: '',
      organRejestrujacy: '',
      dataUzyciaUprawnienia: ''
    });
    setShowModal(true);
  };

  const handleEdit = (uprawnienie: any) => {
    setEditingId(uprawnienie.id);
    setFormData({
      rodzaj: uprawnienie.rodzaj || '',
      npwzIdRizh: uprawnienie.npwzIdRizh || '',
      organRejestrujacy: uprawnienie.organRejestrujacy || '',
      dataUzyciaUprawnienia: uprawnienie.dataUzyciaUprawnienia ? uprawnienie.dataUzyciaUprawnienia.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (uprId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to uprawnienie zawodowe?')) {
      return;
    }

    try {
      await api.delete(`/api/UprawnieniZawodowe/${uprId}`);
      loadUprawnienia();
      alert('Uprawnienie zawodowe zostało usunięte');
    } catch (err) {
      console.error('Błąd podczas usuwania:', err);
      alert('Błąd podczas usuwania uprawnienia zawodowego');
    }
  };

  const handleModalSubmit = async () => {
    try {
      const payload = {
        ...formData,
        osobaId: Number(id)
      };

      console.log('Wysyłane dane do API:', payload);

      if (editingId) {
        console.log(`Aktualizacja uprawnienia zawodowego ID: ${editingId}`);
        const response = await api.put(`/api/UprawnieniZawodowe/${editingId}`, payload);
        console.log('Odpowiedź PUT:', response.data);
        alert('Uprawnienie zawodowe zostało zaktualizowane');
      } else {
        console.log('Dodawanie nowego uprawnienia zawodowego');
        const response = await api.post('/api/UprawnieniZawodowe', payload);
        console.log('Odpowiedź POST:', response.data);
        alert('Uprawnienie zawodowe zostało dodane');
      }

      setShowModal(false);
      loadUprawnienia();
    } catch (err: any) {
      console.error('Błąd podczas zapisywania:', err);
      console.error('Szczegóły błędu:', err.response?.data);
      alert(`Błąd podczas zapisywania danych: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#0044cc', marginBottom: '1.5rem' }}>
        Edycja danych osoby personelu - Uprawnienia zawodowe
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

      {uprawnienia.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b8d4f7' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', width: '50px' }}>Lp.</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Rodzaj</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>NPWZ/ID/RIZH</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Organ rejestrujący</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Data użycia uprawnienia</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {uprawnienia.map((u, index) => (
              <tr key={u.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.rodzaj}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.npwzIdRizh}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.organRejestrujacy}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  {u.dataUzyciaUprawnienia ? u.dataUzyciaUprawnienia.split('T')[0] : ''}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(u)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>edycja</button>
                  <br />
                  <button onClick={() => handleDelete(u.id)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>usuń</button>
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
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#0044cc' }}>
              {editingId ? 'Edytuj uprawnienie zawodowe' : 'Dodaj uprawnienie zawodowe'}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Rodzaj:
              </label>
              <input
                list="rodzaj-list"
                type="text"
                value={formData.rodzaj}
                onChange={(e) => setFormData({ ...formData, rodzaj: e.target.value })}
                onFocus={(e) => {
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
              <datalist id="rodzaj-list">
                {options.rodzaje.map((r, idx) => (
                  <option key={idx} value={r} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                NPWZ/ID/RIZH:
              </label>
              <input
                list="npwz-list"
                type="text"
                value={formData.npwzIdRizh}
                onChange={(e) => setFormData({ ...formData, npwzIdRizh: e.target.value })}
                onFocus={(e) => {
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
              <datalist id="npwz-list">
                {options.npwz.map((n, idx) => (
                  <option key={idx} value={n} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Organ rejestrujący:
              </label>
              <input
                list="organ-list"
                type="text"
                value={formData.organRejestrujacy}
                onChange={(e) => setFormData({ ...formData, organRejestrujacy: e.target.value })}
                onFocus={(e) => {
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
              <datalist id="organ-list">
                {options.organy.map((o, idx) => (
                  <option key={idx} value={o} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Data użycia uprawnienia:
              </label>
              <input
                type="date"
                value={formData.dataUzyciaUprawnienia}
                onChange={(e) => setFormData({ ...formData, dataUzyciaUprawnienia: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
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
                  padding: '8px 16px',
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
