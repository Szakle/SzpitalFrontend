import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function OsobaListPage() {
  const [osoby, setOsoby] = useState<any[]>([]);

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
    <div style={{ padding: '1rem' }}>
      <h2>Lista Osób</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {['Imię', 'Drugie Imię', 'Nazwisko', 'PESEL', 'Data urodzenia', 'Nr PWZ', 'Telefon', 'Płeć', 'Typ Personelu'].map(header => (
              <th key={header} style={{ border: '1px solid #ccc', padding: '8px', background: '#f2f2f2' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {osoby.map(osoba => (
            <tr key={osoba.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.imie}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.imie2}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.nazwisko}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.pesel}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.dataUrodzenia?.split('T')[0]}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.nrPwz}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{osoba.numerTelefonu}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{getPlecLabel(osoba.plecId)}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{getPersonelLabel(osoba.typPersoneluId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
