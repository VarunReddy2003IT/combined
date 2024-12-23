import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Header from './Header';
import Navbar from './Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Clubs from './components/Club';
import Profile from './components/Profile';
import Home from './components/Home';
import About from './components/About';
import Technical from './ClubTypes/Technical';
import Social from './ClubTypes/Social';
import Cultural from './ClubTypes/Cultural';
import ProtectedRoute from './ProtectedRoute'; // Custom ProtectedRoute Component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clubs/technical" element={<Technical />} />
          <Route path="/clubs/social" element={<Social />} />
          <Route path="/clubs/cultural" element={<Cultural />} />

          {/* Protect the login route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute
                element={<Login />}
                redirectTo="/"
                inverse={true} // Only accessible if not logged in
              />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
