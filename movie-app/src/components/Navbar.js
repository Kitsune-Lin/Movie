import React from 'react';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">MOVIE & SERIES</span>
      </div>
      <div className="navbar-center">
        <SearchBar onSearch={onSearch} />
      </div>
    </nav>
  );
};

export default Navbar;
