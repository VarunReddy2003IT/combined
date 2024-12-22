import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider for state management
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
function App() {
  return (
    <AuthProvider> {/* Wrap the application in AuthProvider */}
      <Router>
        <Header />
        <Navbar /> {/* Navbar dynamically updates based on login state */}
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Home />} />
          {/* Other routes */}
          <Route path="/app" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clubs/technical" element={<Technical />} />
          <Route path="/clubs/social" element={<Social />} />
          <Route path="/clubs/cultural" element={<Cultural />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
