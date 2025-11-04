import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AddOsobaPage from './pages/AddOsobaPage';
import OsobaListPage from './pages/OsobaListPage';
import Navbar from './components/Navbar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dodaj-osobe" />} />
            <Route path="/dodaj-osobe" element={<AddOsobaPage />} />
            <Route path="/osoby" element={<OsobaListPage />} />
            <Route path="/login" element={<Navigate to="/dodaj-osobe" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
