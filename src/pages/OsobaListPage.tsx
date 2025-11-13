import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OsobaListPage() {
  const [osoby, setOsoby] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/Osoba')
      .then(res => setOsoby(res.data))
      .catch(err => console.error('Błąd podczas pobierania osób:', err));
  }, []);

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
                    <button
                      onClick={() => navigate(`/edytuj-osobe/${osoba.id}`)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        marginRight: '6px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    >
                      Edytuj osobę
                    </button>
                    <button
                      onClick={() => navigate(`/edytuj-zatrudnienie/${osoba.id}`)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        marginRight: '6px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#138496'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#17a2b8'}
                    >
                      Edytuj zatrudnienie
                    </button>
                    <button
                      onClick={() => navigate(`/zatrudnienie/${osoba.id}`)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                      Podgląd zatrudnienia
                    </button>
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
