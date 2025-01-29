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
import Technical from './components/ClubTypes/Technical';
import Social from './components/ClubTypes/Social';
import Cultural from './components/ClubTypes/Cultural';
import IEEE from './components/AllClubs/IEEE'
import CSI from './components/AllClubs/CSI'
import AlgoRhythm from './components/AllClubs/AlgoRhythm'
import VLSID from './components/AllClubs/VLSID'
import OpenForge from './components/AllClubs/OpenForge'
import SEEE from './components/AllClubs/SEEE'

import ProtectedRoute from './ProtectedRoute';

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
          <Route
            path="/signup"
            element={<ProtectedRoute element={<Signup />} redirectTo="/app" inverse />}
          />
          <Route
            path="/login"
            element={<ProtectedRoute element={<Login />} redirectTo="/app" inverse />}
          />
          <Route
            path="/clubs"
            element={<ProtectedRoute element={<Clubs />} redirectTo="/login" />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} redirectTo="/login" />}
          />
          {/* Protected Routes for Technical, Social, and Cultural */}
          <Route
            path="/clubs/technical"
            element={<ProtectedRoute element={<Technical />} redirectTo="/login" />}
          />
          <Route
            path="/clubs/social"
            element={<ProtectedRoute element={<Social />} redirectTo="/login" />}
          />
          <Route
            path="/clubs/cultural"
            element={<ProtectedRoute element={<Cultural />} redirectTo="/login" />}
          />
          <Route
            path="/ieee"
            element={<ProtectedRoute element={<IEEE />} redirectTo="/app" />}
          />
          <Route
            path="/csi"
            element={<ProtectedRoute element={<CSI />} redirectTo="/app" />}
          />
          <Route
            path="/openforge"
            element={<ProtectedRoute element={<OpenForge />} redirectTo="/app" />}
          />
          <Route
            path="/seee"
            element={<ProtectedRoute element={<SEEE />} redirectTo="/app" />}
          />
          <Route
            path="/algorhythm"
            element={<ProtectedRoute element={<AlgoRhythm />} redirectTo="/app" />}
          />
          <Route
            path="/vlsid"
            element={<ProtectedRoute element={<VLSID />} redirectTo="/app" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
