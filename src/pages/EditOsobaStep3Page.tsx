import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep3Page() {
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

  const loadUprawnienia = () => {
    api.get(`/api/UprawnieniZawodowe/osoba/${id}`)
      .then(res => {
        setUprawnienia(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania uprawnień:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUprawnienia();
  }, [id]);

  const handleBack = () => {
    navigate(`/edytuj-osobe-step2/${id}`, { state: location.state });
  };

  const handleNext = () => {
    navigate(`/edytuj-osobe-step4/${id}`, { state: location.state });
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

  const handleDelete = async (uprawnieniaId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to uprawnienie?')) {
      return;
    }

    try {
      await api.delete(`/api/UprawnieniZawodowe/${uprawnieniaId}`);
      loadUprawnienia();
      alert('Uprawnienie zostało usunięte');
    } catch (err) {
      console.error('Błąd podczas usuwania:', err);
      alert('Błąd podczas usuwania uprawnienia');
    }
  };

  const handleModalSubmit = async () => {
    try {
      const payload = {
        ...formData,
        osobaId: Number(id)
      };

      if (editingId) {
        await api.put(`/api/UprawnieniZawodowe/${editingId}`, payload);
        alert('Uprawnienie zostało zaktualizowane');
      } else {
        await api.post('/api/UprawnieniZawodowe', payload);
        alert('Uprawnienie zostało dodane');
      }

      setShowModal(false);
      loadUprawnienia();
    } catch (err) {
      console.error('Błąd podczas zapisywania:', err);
      alert('Błąd podczas zapisywania danych');
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
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>NPWZ/Id RIZM</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Organ<br/>rejestrujący</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Data uzyskania uprawnienia<br/>Data utraty uprawnienia</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Typ zmian</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {uprawnienia.map((u, index) => (
              <tr key={u.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.rodzaj || 'LEKARZ'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.npwzIdRizh || '3022214'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontSize: '12px' }}>
                  {u.organRejestrujacy || 'Kod: 58\nNazwa: Lubelska Izba Lekarska'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <div>Uzy: {u.dataUzyciaUprawnienia ? u.dataUzyciaUprawnienia.split('T')[0] : '2001-09-26'}</div>
                  <div>Utr: –</div>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>bez zmian</td>
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
