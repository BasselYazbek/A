import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from '../src/Nav.js';
import Main from './Main.js';
import FruitsMenu from './FruitsMenu.js';
import ChocolatesMenu from './CholatesMenu.js';
import ChocolateSpredsMenu from './ChocolateSpredsMenu.js';
import DiscountsMenu from './DiscountsMenu.js';
import GumMenu from './GumMenu'; // New GumMenu component
import Footer from './Footer.js';
import About from './About.js';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut for logout
import { auth } from './firebase';
import Login from './Login'; // Login component with email/password
import AdminPanel from './AdminPanel'; // Admin Panel


// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}


function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Simple check for admin (you can customize this by checking user roles)
        if (user.email === 'admin@example.com') { // Replace with your actual admin email
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setIsAdmin(false); // Reset admin state after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <div>
          <Nav isAdmin={isAdmin} onLogout={handleLogout} />
          <Routes>
            {isAdmin ? (
              <Route path='/admin' element={<AdminPanel />} />
            ) : (
              <Route path='/admin' element={<Login onLoginSuccess={() => setIsAdmin(true)} />} />
            )}
            <Route path='/chocolate' element={<FruitsMenu isAdmin={isAdmin} />} />
            <Route path='/drinks' element={<ChocolatesMenu isAdmin={isAdmin} />} />
            <Route path='/chocolateSpreds' element={<ChocolateSpredsMenu isAdmin={isAdmin} />} />
            <Route path='/discounts' element={<DiscountsMenu isAdmin={isAdmin} />} />
            <Route path='/gum' element={<GumMenu isAdmin={isAdmin} />} /> {/* New Gum route */}
            <Route path='/' exact element={<Main />} />
            <Route path='/about' exact element={<About />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
