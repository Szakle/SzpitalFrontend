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
    kod: '',
    nazwa: '',
    stopienSpecjalizacji: '',
    dataOtwarciaSpecjalizacji: '',
    dyplom: ''
  });
  
  const [options, setOptions] = useState({
    kody: [] as string[],
    nazwy: [] as string[],
    stopnie: [] as string[],
    dyplomy: [] as string[]
  });

  const loadZawody = () => {
    api.get(`/api/ZawodySpecjalnosci/osoba/${id}`)
      .then(res => {
        setUprawnienia(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania zawodów/specjalności:', err);
        setLoading(false);
      });
  };

  const loadOptions = async () => {
    try {
      const [kodyRes, nazwyRes, stopnieRes, dyplomyRes] = await Promise.all([
        api.get('/api/ZawodySpecjalnosci/options/kod'),
        api.get('/api/ZawodySpecjalnosci/options/nazwa'),
        api.get('/api/ZawodySpecjalnosci/options/stopien'),
        api.get('/api/ZawodySpecjalnosci/options/dyplom')
      ]);
      
      console.log('Załadowano opcje:', {
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        stopnie: stopnieRes.data,
        dyplomy: dyplomyRes.data
      });
      
      setOptions({
        kody: kodyRes.data,
        nazwy: nazwyRes.data,
        stopnie: stopnieRes.data,
        dyplomy: dyplomyRes.data
      });
    } catch (err) {
      console.error('Błąd podczas pobierania opcji:', err);
    }
  };

  useEffect(() => {
    loadZawody();
    loadOptions();
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
      kod: '',
      nazwa: '',
      stopienSpecjalizacji: '',
      dataOtwarciaSpecjalizacji: '',
      dyplom: ''
    });
    setShowModal(true);
  };

  const handleEdit = (uprawnienie: any) => {
    setEditingId(uprawnienie.id);
    setFormData({
      kod: uprawnienie.kod || '',
      nazwa: uprawnienie.nazwa || '',
      stopienSpecjalizacji: uprawnienie.stopienSpecjalizacji || '',
      dataOtwarciaSpecjalizacji: uprawnienie.dataOtwarciaSpecjalizacji ? uprawnienie.dataOtwarciaSpecjalizacji.split('T')[0] : '',
      dyplom: uprawnienie.dyplom || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (zawodId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten zawód/specjalność?')) {
      return;
    }

    try {
      await api.delete(`/api/ZawodySpecjalnosci/${zawodId}`);
      loadZawody();
      alert('Zawód/specjalność został usunięty');
    } catch (err) {
      console.error('Błąd podczas usuwania:', err);
      alert('Błąd podczas usuwania zawodu/specjalności');
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
        console.log(`Aktualizacja zawodu/specjalności ID: ${editingId}`);
        const response = await api.put(`/api/ZawodySpecjalnosci/${editingId}`, payload);
        console.log('Odpowiedź PUT:', response.data);
        alert('Zawód/specjalność został zaktualizowany');
      } else {
        console.log('Dodawanie nowego zawodu/specjalności');
        const response = await api.post('/api/ZawodySpecjalnosci', payload);
        console.log('Odpowiedź POST:', response.data);
        alert('Zawód/specjalność został dodany');
      }

      setShowModal(false);
      loadZawody();
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
        Edycja danych osoby personelu - Zawody i specjalności
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
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Kod</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Nazwa</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Stopień specjalizacji</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Data otwarcia specjalizacji</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Dyplom</th>
              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Operacje</th>
            </tr>
          </thead>
          <tbody>
            {uprawnienia.map((u, index) => (
              <tr key={u.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.kod || '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.nazwa || '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.stopienSpecjalizacji || '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  {u.dataOtwarciaSpecjalizacji ? new Date(u.dataOtwarciaSpecjalizacji).toLocaleDateString('pl-PL') : '-'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.dyplom || '-'}</td>
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

      {/* Modal do dodawania/edycji uprawnień */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edytuj zawód/specjalność' : 'Dodaj zawód/specjalność'}</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Kod:</label>
              <input
                list="kody-list"
                type="text"
                value={formData.kod}
                onChange={(e) => setFormData({ ...formData, kod: e.target.value })}
                onFocus={(e) => e.target.showPicker?.()}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="Wybierz lub wpisz nową wartość"
              />
              <datalist id="kody-list">
                {options.kody.map((k, idx) => (
                  <option key={idx} value={k} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nazwa:</label>
              <input
                list="nazwy-list"
                type="text"
                value={formData.nazwa}
                onChange={(e) => setFormData({ ...formData, nazwa: e.target.value })}
                onFocus={(e) => e.target.showPicker?.()}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="Wybierz lub wpisz nową wartość"
              />
              <datalist id="nazwy-list">
                {options.nazwy.map((n, idx) => (
                  <option key={idx} value={n} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stopień specjalizacji:</label>
              <input
                list="stopnie-list"
                type="text"
                value={formData.stopienSpecjalizacji}
                onChange={(e) => setFormData({ ...formData, stopienSpecjalizacji: e.target.value })}
                onFocus={(e) => e.target.showPicker?.()}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="Wybierz lub wpisz nową wartość"
              />
              <datalist id="stopnie-list">
                {options.stopnie.map((s, idx) => (
                  <option key={idx} value={s} />
                ))}
              </datalist>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data otwarcia specjalizacji:</label>
              <input
                type="date"
                value={formData.dataOtwarciaSpecjalizacji}
                onChange={(e) => setFormData({ ...formData, dataOtwarciaSpecjalizacji: e.target.value })}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Dyplom:</label>
              <input
                list="dyplomy-list"
                type="text"
                value={formData.dyplom}
                onChange={(e) => setFormData({ ...formData, dyplom: e.target.value })}
                onFocus={(e) => e.target.showPicker?.()}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="Wybierz lub wpisz nową wartość"
              />
              <datalist id="dyplomy-list">
                {options.dyplomy.map((d, idx) => (
                  <option key={idx} value={d} />
                ))}
              </datalist>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
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
                  cursor: 'pointer'
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
