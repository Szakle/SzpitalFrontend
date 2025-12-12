import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OsobaListPage() {
  const [osoby, setOsoby] = useState<any[]>([]);
  const [pesel, setPesel] = useState('');
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [plecId, setPlecId] = useState<string>('');
  const [typPersoneluId, setTypPersoneluId] = useState<string>('');
  const [plecIds, setPlecIds] = useState<number[]>([]);
  const [typPersoneluIds, setTypPersoneluIds] = useState<number[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [aktywnieZatrudnieni, setAktywnieZatrudnieni] = useState<string>('');
  const [majaOgraniczenia, setMajaOgraniczenia] = useState<string>('');
  const [rodzajWyksztalcenia, setRodzajWyksztalcenia] = useState<string>('');
  const navigate = useNavigate();

  const fetchOsoby = () => {
    const params = new URLSearchParams();
    if (pesel) params.append('pesel', pesel);
    if (imie) params.append('imie', imie);
    if (nazwisko) params.append('nazwisko', nazwisko);
    if (plecId) params.append('plecId', plecId);
    if (typPersoneluId) params.append('typPersoneluId', typPersoneluId);
    if (aktywnieZatrudnieni) params.append('aktywnieZatrudnieni', aktywnieZatrudnieni);
    if (majaOgraniczenia) params.append('majaOgraniczenia', majaOgraniczenia);
    if (rodzajWyksztalcenia) params.append('rodzajWyksztalcenia', rodzajWyksztalcenia);
    
    api.get(`/api/Osoba?${params.toString()}`)
      .then(res => setOsoby(res.data))
      .catch(err => console.error('Błąd podczas pobierania osób:', err));
  };

  useEffect(() => {
    // Pobierz opcje filtrów
    api.get('/api/Osoba/filters')
      .then(res => {
        setPlecIds(res.data.plecIds);
        setTypPersoneluIds(res.data.typPersoneluIds);
      })
      .catch(err => console.error('Błąd podczas pobierania filtrów:', err));
    
    fetchOsoby();
  }, []);

  const handleSearch = () => {
    fetchOsoby();
  };

  const handleReset = () => {
    setPesel('');
    setImie('');
    setNazwisko('');
    setPlecId('');
    setTypPersoneluId('');
    setAktywnieZatrudnieni('');
    setMajaOgraniczenia('');
    setRodzajWyksztalcenia('');
    api.get('/api/Osoba')
      .then(res => setOsoby(res.data))
      .catch(err => console.error('Błąd podczas pobierania osób:', err));
  };

  const exportToExcel = () => {
    // Przygotowanie danych
    const data = osoby.map(o => ({
      'Imię': o.imie,
      'Drugie Imię': o.imie2 || '-',
      'Nazwisko': o.nazwisko,
      'PESEL': o.pesel || '-',
      'Data urodzenia': o.dataUrodzenia ? new Date(o.dataUrodzenia).toLocaleDateString('pl-PL') : '-',
      'Nr PWZ': o.nrPwz,
      'Telefon': o.numerTelefonu || '-',
      'Płeć': getPlecLabel(o.plecId),
      'Typ Personelu': getPersonelLabel(o.typPersoneluId)
    }));

    // Konwersja do CSV (Excel otworzy to bez problemu)
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(';'),
      ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(';'))
    ].join('\n');

    // Dodanie BOM dla poprawnego kodowania polskich znaków
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lista_osob_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setShowExportModal(false);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lista Osób</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #007bff; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          @media print {
            body { padding: 10px; }
            th, td { padding: 4px; font-size: 10px; }
          }
        </style>
      </head>
      <body>
        <h1>Lista Osób</h1>
        <p><strong>Data wygenerowania:</strong> ${new Date().toLocaleString('pl-PL')}</p>
        <table>
          <thead>
            <tr>
              <th>Imię</th>
              <th>Drugie Imię</th>
              <th>Nazwisko</th>
              <th>PESEL</th>
              <th>Data urodzenia</th>
              <th>Nr PWZ</th>
              <th>Telefon</th>
              <th>Płeć</th>
              <th>Typ Personelu</th>
            </tr>
          </thead>
          <tbody>
            ${osoby.map(o => `
              <tr>
                <td>${o.imie}</td>
                <td>${o.imie2 || '-'}</td>
                <td>${o.nazwisko}</td>
                <td>${o.pesel || '-'}</td>
                <td>${o.dataUrodzenia ? new Date(o.dataUrodzenia).toLocaleDateString('pl-PL') : '-'}</td>
                <td>${o.nrPwz}</td>
                <td>${o.numerTelefonu || '-'}</td>
                <td>${getPlecLabel(o.plecId)}</td>
                <td>${getPersonelLabel(o.typPersoneluId)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
    setShowExportModal(false);
  };

  const getPlecLabel = (id: number) => {
    switch (id) {
      case 1: return 'Kobieta';
      case 2: return 'Mężczyzna';
      case 3: return 'Inne';
      default: return 'Nieznana';
    }
  };

  const getPersonelLabel = (id: number) => {
    switch (id) {
      case 1: return 'Lekarz';
      case 2: return 'Pielęgniarka';
      case 3: return 'Ratownik';
      case 4: return 'Technik Medyczny';
      default: return 'Inny';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '2rem',
          color: '#333',
          fontSize: '28px',
          fontWeight: '600',
          borderBottom: '2px solid #007bff',
          paddingBottom: '1rem'
        }}>
          Lista Osób
        </h2>

        {/* Sekcja filtrowania */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '18px', color: '#495057' }}>
            Wyszukiwanie
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                PESEL
              </label>
              <input
                type="text"
                value={pesel}
                onChange={(e) => setPesel(e.target.value)}
                placeholder="Wpisz PESEL..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Imię
              </label>
              <input
                type="text"
                value={imie}
                onChange={(e) => setImie(e.target.value)}
                placeholder="Wpisz imię..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Nazwisko
              </label>
              <input
                type="text"
                value={nazwisko}
                onChange={(e) => setNazwisko(e.target.value)}
                placeholder="Wpisz nazwisko..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '18px', color: '#495057' }}>
            Filtry
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Płeć
              </label>
              <select
                value={plecId}
                onChange={(e) => setPlecId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Wszystkie</option>
                {plecIds.map(id => (
                  <option key={id} value={id}>{getPlecLabel(id)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Typ Personelu
              </label>
              <select
                value={typPersoneluId}
                onChange={(e) => setTypPersoneluId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Wszystkie</option>
                {typPersoneluIds.map(id => (
                  <option key={id} value={id}>{getPersonelLabel(id)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Status Zatrudnienia
              </label>
              <select
                value={aktywnieZatrudnieni}
                onChange={(e) => setAktywnieZatrudnieni(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Wszyscy</option>
                <option value="true">Aktywnie zatrudnieni</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Ograniczenia Uprawnień
              </label>
              <select
                value={majaOgraniczenia}
                onChange={(e) => setMajaOgraniczenia(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Wszyscy</option>
                <option value="true">Mają ograniczenia</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Wykształcenie
              </label>
              <select
                value={rodzajWyksztalcenia}
                onChange={(e) => setRodzajWyksztalcenia(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Wszystkie</option>
                <option value="Wyższe">Wyższe</option>
                <option value="Medycyna">Medycyna</option>
                <option value="Pielęgniarstwo">Pielęgniarstwo</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSearch}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Szukaj
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#495057',
                backgroundColor: 'white',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Wyczyść
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#28a745',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginLeft: 'auto'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              ▼ Drukuj Tabelę
            </button>
          </div>
        </div>

        {/* Modal wyboru formatu eksportu */}
        {showExportModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              minWidth: '400px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>
                Wybierz format eksportu
              </h3>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Liczba rekordów do eksportu: <strong>{osoby.length}</strong>
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={exportToExcel}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#28a745',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                  📄 Excel (CSV)
                </button>
                <button
                  onClick={exportToPDF}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#dc3545',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                >
                  📄 PDF (Drukuj)
                </button>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  color: '#495057',
                  backgroundColor: 'white',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1200px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                {['Imię', 'Drugie Imię', 'Nazwisko', 'PESEL', 'Data urodzenia', 'Nr PWZ', 'Telefon', 'Płeć', 'Typ Personelu', 'Operacje'].map(header => (
                  <th key={header} style={{ 
                    border: '1px solid #dee2e6', 
                    padding: '12px', 
                    background: '#e9ecef',
                    fontWeight: '600',
                    color: '#495057',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {osoby.map((osoba, index) => (
                <tr key={osoba.id} style={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f3ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8f9fa'}
                >
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.imie}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.imie2}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.nazwisko}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.pesel}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.dataUrodzenia?.split('T')[0]}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.nrPwz || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{osoba.numerTelefonu || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{getPlecLabel(osoba.plecId)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', fontSize: '14px', color: '#212529' }}>{getPersonelLabel(osoba.typPersoneluId)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '12px', whiteSpace: 'nowrap' }}>
                    <select
                      style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        width: '100%',
                        minWidth: '200px'
                      }}
                      defaultValue=""
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          navigate(value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="" disabled>Wybierz operację...</option>
                      <option value={`/edytuj-osobe/${osoba.id}`}>Edytuj osobę</option>
                      <option value={`/edytuj-zatrudnienie/${osoba.id}`}>Edytuj zatrudnienie</option>
                      <option value={`/rozwiaz-zatrudnienie/${osoba.id}`}>Rozwiąż zatrudnienie</option>
                      <option value={`/usun-zatrudnienie/${osoba.id}`}>Usuń zatrudnienie</option>
                      <option value={`/miejsca-pracy/${osoba.id}`}>Miejsca pracy</option>
                      <option value={`/zatrudnienie/${osoba.id}`}>Podgląd zatrudnienia</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
