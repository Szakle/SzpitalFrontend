import React, { useState } from 'react';
import api from '../services/api';

export default function AddOsobaPage() {
  const [form, setForm] = useState({
    imie: '',
    imie2: '',
    nazwisko: '',
    pesel: '',
    plecId: 1,
    dataUrodzenia: '',
    typPersoneluId: 1,
    nrPwz: '',
    numerTelefonu: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/api/Osoba', {
        ...form,
        plecId: Number(form.plecId),
        typPersoneluId: Number(form.typPersoneluId),
      });
      alert('Dodano osobę!');
    } catch (err) {
      alert('Błąd przy dodawaniu.');
    }
  };

  return (
    <div>
      <h2>Dodaj Osobę</h2>
      <input name="imie" value={form.imie} onChange={handleChange} placeholder="Imię" />
      <input name="imie2" value={form.imie2} onChange={handleChange} placeholder="Drugie Imię" />
      <input name="nazwisko" value={form.nazwisko} onChange={handleChange} placeholder="Nazwisko" />
      <input name="pesel" value={form.pesel} onChange={handleChange} placeholder="PESEL" />
      <input name="nrPwz" value={form.nrPwz} onChange={handleChange} placeholder="Nr PWZ" />
      <input name="numerTelefonu" value={form.numerTelefonu} onChange={handleChange} placeholder="Numer telefonu" />
      <input name="dataUrodzenia" type="date" value={form.dataUrodzenia} onChange={handleChange} />
      
      <select name="plecId" value={form.plecId} onChange={handleChange}>
        <option value={1}>Kobieta</option>
        <option value={2}>Mężczyzna</option>
        <option value={3}>Inne</option>
      </select>

      <select name="typPersoneluId" value={form.typPersoneluId} onChange={handleChange}>
        <option value={1}>Lekarz</option>
        <option value={2}>Pielęgniarka</option>
        <option value={3}>Ratownik</option>
        <option value={4}>Technik Medyczny</option>
      </select>

      <br />
      <button onClick={handleSubmit}>Zapisz</button>
    </div>
  );
}
