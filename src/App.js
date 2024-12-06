import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Main from './Main';
import FruitsMenu from './FruitsMenu';
import ChocolatesMenu from './CholatesMenu';
import ChocolateSpredsMenu from './ChocolateSpredsMenu';
import DiscountsMenu from './DiscountsMenu';
import GumMenu from './GumMenu';
import Footer from './Footer';
import About from './About';
import LandingPage from './LandingPage';
import Login from './Login';
import AdminPanel from './AdminPanel';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user && user.email === 'admin@example.com');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setIsAdmin(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <RoutesWrapper isAdmin={isAdmin} setIsAdmin={setIsAdmin} onLogout={handleLogout} />
      <Footer />
    </Router>
  );
}

function RoutesWrapper({ isAdmin, setIsAdmin, onLogout }) {
  const location = useLocation(); // Properly placed within Router context
  const showNav = location.pathname !== '/'; // Don't show Nav on the landing page

  return (
    <>
      {showNav && <Nav isAdmin={isAdmin} onLogout={onLogout} />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/main' element={<Main />} />
        <Route path='/admin' element={isAdmin ? <AdminPanel /> : <Login onLoginSuccess={() => setIsAdmin(true)} />} />
        <Route path='/chocolate' element={<FruitsMenu isAdmin={isAdmin} />} />
        <Route path='/drinks' element={<ChocolatesMenu isAdmin={isAdmin} />} />
        <Route path='/chocolateSpreds' element={<ChocolateSpredsMenu isAdmin={isAdmin} />} />
        <Route path='/discounts' element={<DiscountsMenu isAdmin={isAdmin} />} />
        <Route path='/gum' element={<GumMenu isAdmin={isAdmin} />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </>
  );
}

export default App;
