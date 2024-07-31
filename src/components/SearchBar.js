import React, { useState } from 'react';
import './SearchBar.css';

// Componente funcional SearchBar que maneja la lógica de la barra de búsqueda
const SearchBar = ({ onSearch }) => {
  // Define el estado para la consulta de búsqueda
  const [query, setQuery] = useState('');

  // Maneja el cambio en el campo de entrada de texto
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Maneja el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      {/* Campo de entrada de texto para la búsqueda */}
      <input
        type="text"
        placeholder="Busca una película, una serie, un actor..." // Placeholder para guiar al usuario
        value={query} // Valor del estado query
        onChange={handleInputChange} // Llama a handleInputChange en cada cambio
      />
      {/* Botón de envío del formulario */}
      <button type="submit">🔍</button>
    </form>
  );
};

export default SearchBar;
