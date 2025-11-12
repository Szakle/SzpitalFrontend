import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ZatrudnieniePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [osoba, setOsoba] = useState<any>(null);
  const [zatrudnienie, setZatrudnienie] = useState<any>(null);
  const [wyksztalcenia, setWyksztalcenia] = useState<any[]>([]);
  const [uprawnienia, setUprawnienia] = useState<any[]>([]);
  const [ograniczenia, setOgraniczenia] = useState<any[]>([]);
  const [zawody, setZawody] = useState<any[]>([]);
  const [kompetencje, setKompetencje] = useState<any[]>([]);
  const [doswiadczenie, setDoswiadczenie] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('wyksztalcenie');

  useEffect(() => {
    if (id) {
      // Pobierz dane osoby
      api.get(`/api/Osoba/${id}`)
        .then(res => {
          console.log('Pobrane dane osoby:', res.data);
          setOsoba(res.data);
        })
        .catch(err => {
          console.error('Błąd podczas pobierania danych osoby:', err);
          setError(true);
        });

      // Pobierz dane zatrudnienia
      api.get(`/api/Zatrudnienie/osoba/${id}`)
        .then(res => {
          console.log('Pobrane dane zatrudnienia:', res.data);
          setZatrudnienie(res.data);
        })
        .catch(err => {
          console.error('Błąd podczas pobierania danych zatrudnienia:', err);
          setZatrudnienie(null);
        });

      // Pobierz wykształcenia
      api.get(`/api/Wyksztalcenie/osoba/${id}`)
        .then(res => {
          console.log('Pobrane wykształcenia:', res.data);
          setWyksztalcenia(res.data || []);
        })
        .catch(err => console.error('Błąd podczas pobierania wykształceń:', err));

      // Pobierz uprawnienia zawodowe
      api.get(`/api/UprawnieniZawodowe/osoba/${id}`)
        .then(res => {
          console.log('Pobrane uprawnienia:', res.data);
          setUprawnienia(res.data || []);
        })
        .catch(err => console.error('Błąd podczas pobierania uprawnień:', err));

      // Pobierz ograniczenia
      api.get(`/api/OgraniczeniaUprawnien/osoba/${id}`)
        .then(res => {
          console.log('Pobrane ograniczenia:', res.data);
          setOgraniczenia(res.data || []);
        })
        .catch(err => console.error('Błąd podczas pobierania ograniczeń:', err));

      // Pobierz zawody/specjalności
      api.get(`/api/ZawodySpecjalnosci/osoba/${id}`)
        .then(res => {
          console.log('Pobrane zawody:', res.data);
          setZawody(res.data || []);
        })
        .catch(err => console.error('Błąd podczas pobierania zawodów:', err));

      // Pobierz kompetencje
      api.get(`/api/KompetencjeUmiejetnosci/osoba/${id}`)
        .then(res => {
          console.log('Pobrane kompetencje:', res.data);
          setKompetencje(res.data || []);
        })
        .catch(err => console.error('Błąd podczas pobierania kompetencji:', err));

      // Pobierz doświadczenie zawodowe
      api.get(`/api/DoswiadczenieZawodowe/osoba/${id}`)
        .then(res => {
          console.log('Pobrane doświadczenie:', res.data);
          setDoswiadczenie(res.data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Błąd podczas pobierania doświadczenia:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div style={{ padding: '1rem' }}>Ładowanie...</div>;

  const getPlecLabel = (id?: number) => {
    switch (id) {
      case 1: return 'Kobieta';
      case 2: return 'Mężczyzna';
      case 3: return 'Inne';
      default: return '-';
    }
  };

  const getPersonelLabel = (id?: number) => {
    switch (id) {
      case 1: return 'Lekarz';
      case 2: return 'Pielęgniarka';
      case 3: return 'Ratownik';
      case 4: return 'Technik Medyczny';
      default: return '-';
    }
  };

  const tabs = [
    { id: 'wyksztalcenie', label: 'Wykształcenie' },
    { id: 'uprawnienia', label: 'Uprawnienia zawodowe' },
    { id: 'ograniczenia', label: 'Ograniczenia upr. zaw.' },
    { id: 'zawody', label: 'Zawody/specjalności' },
    { id: 'kompetencje', label: 'Kompetencje i umiejętności' },
    { id: 'doswiadczenie', label: 'Doświadczenie zawodowe' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wyksztalcenie':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Rodzaj</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Kierunek</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Uczelnia</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Data ukończenia</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Dyplom</th>
              </tr>
            </thead>
            <tbody>
              {wyksztalcenia && wyksztalcenia.length > 0 ? (
                wyksztalcenia.map((w: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{w.rodzajWyksztalcenia || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{w.kierunek || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{w.uczelnia || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{w.dataUkonczenia ? w.dataUkonczenia.split('T')[0] : '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{w.dyplom || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case 'uprawnienia':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Rodzaj</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>NPWZ/Id RIZH</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Organ rejestrujący</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Data użycia uprawnienia</th>
              </tr>
            </thead>
            <tbody>
              {uprawnienia && uprawnienia.length > 0 ? (
                uprawnienia.map((u: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{u.rodzaj || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{u.npwzIdRizh || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{u.organRejestrujacy || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{u.dataUzyciaUprawnienia ? u.dataUzyciaUprawnienia.split('T')[0] : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case 'ograniczenia':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Typ ograniczenia</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Opis</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Od</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Do</th>
              </tr>
            </thead>
            <tbody>
              {ograniczenia && ograniczenia.length > 0 ? (
                ograniczenia.map((o: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{o.typOgraniczenia || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{o.opis || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{o.dataOd ? o.dataOd.split('T')[0] : '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{o.dataDo ? o.dataDo.split('T')[0] : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case 'zawody':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Kod</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Nazwa</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Stopień specjalizacji</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Data otwarcia specjalizacji</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Dyplom</th>
              </tr>
            </thead>
            <tbody>
              {zawody && zawody.length > 0 ? (
                zawody.map((z: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{z.kod || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{z.nazwa || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{z.stopienSpecjalizacji || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{z.dataOtwarciaSpecjalizacji ? z.dataOtwarciaSpecjalizacji.split('T')[0] : '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{z.dyplom || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case 'kompetencje':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Kod</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Nazwa</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Poziom</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Zaświadczenie</th>
              </tr>
            </thead>
            <tbody>
              {kompetencje && kompetencje.length > 0 ? (
                kompetencje.map((k: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{k.kod || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{k.nazwa || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{k.poziom || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{k.zaswiadczenie || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case 'doswiadczenie':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e7f3ff' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Kod</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Nazwa</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Zaświadczenie</th>
              </tr>
            </thead>
            <tbody>
              {doswiadczenie && doswiadczenie.length > 0 ? (
                doswiadczenie.map((d: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{d.kod || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{d.nazwa || '-'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{d.zaswiadczenie || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/osoby')}
        style={{
          padding: '8px 16px',
          marginBottom: '1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ← Powrót do zatrudnionych personelu
      </button>

      <h2>Zatrudniony personel</h2>
      
      {!error && osoba && (
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <p><strong>Identyfikator:</strong> {osoba.id}</p>
          <p><strong>Nazwa:</strong> {osoba.imie} {osoba.imie2 ? osoba.imie2 + ' ' : ''}{osoba.nazwisko}</p>
        </div>
      )}

      <h3>Dane podstawowe</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold', width: '200px' }}>PESEL:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.pesel || '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Data urodzenia:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.dataUrodzenia ? osoba.dataUrodzenia.split('T')[0] : '-'}</td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Imię:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.imie || '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Drugie imię:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.imie2 || '-'}</td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Nazwisko:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.nazwisko || '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Numer telefonu:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{osoba?.numerTelefonu || '-'}</td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Płeć:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{getPlecLabel(osoba?.plecId)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Typ personelu:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{getPersonelLabel(osoba?.typPersoneluId)}</td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', fontWeight: 'bold' }}>Nr PWZ:</td>
            <td style={{ padding: '8px' }}>{osoba?.nrPwz || '-'}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>Zatrudnienie</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold', width: '200px' }}>Zatrudnienie/deklaracja zatrudnienia:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{zatrudnienie?.zatrudnienieDeklaracja || '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Zatrudniony od:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{zatrudnienie?.zatrudnionyOd ? zatrudnienie.zatrudnionyOd.split('T')[0] : '-'}</td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Zatrudniony do:</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{zatrudnienie?.zatrudnionyDo ? zatrudnienie.zatrudnionyDo.split('T')[0] : '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', fontWeight: 'bold' }}>Średnioczasowy czas pracy godziny/minuty:</td>
            <td style={{ padding: '8px' }}>{zatrudnienie?.srednioczasowyCzasPracy || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Tab Navigation */}
      <div style={{ marginTop: '2rem', borderBottom: '2px solid #ddd', display: 'flex', gap: '0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              backgroundColor: activeTab === tab.id ? '#007bff' : '#f0f0f0',
              color: activeTab === tab.id ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #0056b3' : 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              borderRadius: '4px 4px 0 0',
              marginRight: '2px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '1.5rem 0', borderTop: '1px solid #ddd' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}
