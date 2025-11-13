import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AddOsobaPage from './pages/AddOsobaPage';
import OsobaListPage from './pages/OsobaListPage';
import EditOsobaPage from './pages/EditOsobaPage';
import ZatrudnieniePage from './pages/ZatrudnieniePage';
import EditZatrudnieniePage from './pages/EditZatrudnieniePage';
import Navbar from './components/Navbar';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minut w milisekundach

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
      return true;
    }
    localStorage.removeItem('sessionExpiry');
    return false;
  });

  const resetSessionTimer = useCallback(() => {
    const expiryTime = Date.now() + SESSION_TIMEOUT;
    localStorage.setItem('sessionExpiry', expiryTime.toString());
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    resetSessionTimer();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sessionExpiry');
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // Resetuj timer przy każdej aktywności użytkownika
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetSessionTimer();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Sprawdzaj co minutę, czy sesja nie wygasła
    const checkSession = setInterval(() => {
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      if (!sessionExpiry || Date.now() >= parseInt(sessionExpiry)) {
        alert('Sesja wygasła. Zostaniesz wylogowany.');
        handleLogout();
      }
    }, 60000); // Sprawdzaj co minutę

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(checkSession);
    };
  }, [isLoggedIn, resetSessionTimer]);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dodaj-osobe" />} />
            <Route path="/dodaj-osobe" element={<AddOsobaPage />} />
            <Route path="/osoby" element={<OsobaListPage />} />
            <Route path="/edytuj-osobe/:id" element={<EditOsobaPage />} />
            <Route path="/zatrudnienie/:id" element={<ZatrudnieniePage />} />
            <Route path="/edytuj-zatrudnienie/:id" element={<EditZatrudnieniePage />} />
            <Route path="/login" element={<Navigate to="/dodaj-osobe" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
