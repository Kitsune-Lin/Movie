import React, { useEffect, useState, useCallback } from 'react';
import MovieCard from './MovieCard';
import './Movies.css';

const Movies = ({ data, fetchMore, type }) => {
  // Estado local para almacenar todos los datos de las películas/series
  const [allData, setAllData] = useState(data);

  // Actualiza el estado allData cuando el prop data cambie
  useEffect(() => {
    setAllData(data);
  }, [data]);

  // Función de callback que maneja el evento de scroll para cargar más datos
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      fetchMore(type); // Llama a la función fetchMore pasada como prop
    }
  }, [fetchMore, type]);

  // Añade y elimina el evento de scroll cuando el componente se monta y desmonta
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="movies-container">
      {allData.length === 0 ? (
        <p>No se encontraron resultados.</p> // Mensaje cuando no hay datos
      ) : (
        // Mapea y renderiza una MovieCard por cada item en allData
        allData.map(item => (
          <MovieCard key={item.id} movie={item} />
        ))
      )}
    </div>
  );
};

export default Movies;
