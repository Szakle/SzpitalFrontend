import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function EditOsobaStep5Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [kompetencje, setKompetencje] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kod: '',
    nazwa: '',
    poziom: '',
    zaswiadczenie: ''
  });
  
  const [options, setOptions] = useState({
    kody: [] as string[],
    nazwy: [] as string[],
    poziomy: [] as string[],
    zaswiadczenia: [] as string[]
  });

  const loadKompetencje = () => {
    api.get(`/api/KompetencjeUmiejetnosci/osoba/${id}`)
      .then(res => {
        setKompetencje(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania kompetencji:', err);
        setLoading(false);
      });
  };

  const loadOptions = async () => {
    try {
      const [kodyRes, nazwyRes, poziomyRes, zaswiadczeniaRes] = await Promise.all([
        api.get('/api/KompetencjeUmiejetnosci/options/kod'),
        api.get('/api/KompetencjeUmiejetnosci/options/nazwa'),
        api.get('/api/KompetencjeUmiejetnosci/options/poziom'),
        api.get('/api/KompetencjeUmiejetnosci/options/zaswiadczenie')
      ]);

      console.log('Załadowano opcje:', {
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        poziomy: poziomyRes.data,
        zaswiadczenia: zaswiadczeniaRes.data
      });

      setOptions({
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        poziomy: poziomyRes.data,
        zaswiadczenia: zaswiadczeniaRes.data
      });
    } catch (err) {
      console.error('Błąd podczas pobierania opcji:', err);
    }
  };

  useEffect(() => {
    loadKompetencje();
    loadOptions();
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

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      kod: '',
      nazwa: '',
      poziom: '',
      zaswiadczenie: ''
    });
    setShowModal(true);
  };

  const handleEdit = (kompetencja: any) => {
    setEditingId(kompetencja.id);
    setFormData({
      kod: kompetencja.kod || '',
      nazwa: kompetencja.nazwa || '',
      poziom: kompetencja.poziom || '',
      zaswiadczenie: kompetencja.zaswiadczenie || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (kompId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę kompetencję/umiejętność?')) {
      return;
    }

    try {
      await api.delete(`/api/KompetencjeUmiejetnosci/${kompId}`);
      loadKompetencje();
      alert('Kompetencja/umiejętność została usunięta');
    } catch (err) {
      console.error('Błąd podczas usuwania:', err);
      alert('Błąd podczas usuwania kompetencji/umiejętności');
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
        console.log(`Aktualizacja kompetencji/umiejętności ID: ${editingId}`);
        const response = await api.put(`/api/KompetencjeUmiejetnosci/${editingId}`, payload);
        console.log('Odpowiedź PUT:', response.data);
        alert('Kompetencja/umiejętność została zaktualizowana');
      } else {
        console.log('Dodawanie nowej kompetencji/umiejętności');
        const response = await api.post('/api/KompetencjeUmiejetnosci', payload);
        console.log('Odpowiedź POST:', response.data);
        alert('Kompetencja/umiejętność została dodana');
      }

      setShowModal(false);
      loadKompetencje();
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
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#0044cc', marginBottom: '1.5rem' }}>
        Edycja danych osoby personelu - Kompetencje i umiejętności
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

      {kompetencje.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b8d4f7' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', width: '50px' }}>Lp.</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kod</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Nazwa</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Poziom</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Zaświadczenie</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {kompetencje.map((k, index) => (
              <tr key={k.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{k.kod}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{k.nazwa}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{k.poziom}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{k.zaswiadczenie}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(k)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>edycja</button>
                  <br />
                  <button onClick={() => handleDelete(k.id)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>usuń</button>
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
              {editingId ? 'Edytuj kompetencję/umiejętność' : 'Dodaj kompetencję/umiejętność'}
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
              <datalist id="nazwa-list">
                {options.nazwy.map((n, idx) => (
                  <option key={idx} value={n} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Poziom:
              </label>
              <input
                list="poziom-list"
                type="text"
                value={formData.poziom}
                onChange={(e) => setFormData({ ...formData, poziom: e.target.value })}
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
              <datalist id="poziom-list">
                {options.poziomy.map((p, idx) => (
                  <option key={idx} value={p} />
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
