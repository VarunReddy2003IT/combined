import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './Navbar';
import SuccessPage from './components/SuccessPage'; // New component for success page

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/app" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<SuccessPage />} /> {/* Route for success page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
