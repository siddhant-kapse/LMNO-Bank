// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginSignup from '../components/LoginSignup';
import Dashboard from '../pages/Dashboard';
import CustomerOnboarding from '../pages/CustomerOnboarding';
import CustomerVerification from '../pages/CustomerVerification';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginSignup setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard setIsLoggedIn={setIsLoggedIn}/>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/customer-onboarding"
          element={
            isLoggedIn ? (
              <CustomerOnboarding setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/customer-verification" element={<CustomerVerification />} />
      </Routes>
    </Router>
  );
}

export default App;