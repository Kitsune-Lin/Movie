import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = ({ onSearch, resetSearch, showSearch = true }) => {
  const navigate = useNavigate();

  // Función para manejar el clic en los enlaces de navegación
  const handleLinkClick = (path) => {
    resetSearch(); // Reinicia la búsqueda al cambiar de página
    navigate(path); // Navega a la ruta especificada
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo y título de la aplicación */}
        <img src="logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">MOVIE & SERIES</span>
      </div>
      <div className="navbar-center">
        {/* Muestra la barra de búsqueda solo si showSearch es true */}
        {showSearch && <SearchBar onSearch={onSearch} />}
      </div>
      <div className="navbar-right">
        {/* Botones de navegación */}
        <button className="navbar-link" onClick={() => handleLinkClick('/')}>HOME</button>
        <button className="navbar-link" onClick={() => handleLinkClick('/movies')}>PELICULAS</button>
        <button className="navbar-link" onClick={() => handleLinkClick('/series')}>SERIES</button>
      </div>
    </nav>
  );
};

export default Navbar;
