import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/dodaj-osobe" style={{ marginRight: '1rem' }}>
        Dodaj Osobę
      </Link>
      <Link to="/osoby">Lista Osób</Link>
    </nav>
  );
};

export default Navbar;
