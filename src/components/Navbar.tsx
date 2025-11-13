import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/dodaj-osobe" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>
          Dodaj Osobę
        </Link>
        <Link to="/osoby" style={{ textDecoration: 'none', color: '#007bff' }}>
          Lista Osób
        </Link>
      </div>
      <button
        onClick={onLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Wyloguj
      </button>
    </nav>
  );
};

export default Navbar;
