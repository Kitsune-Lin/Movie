import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

// Componente funcional que muestra una tarjeta de película o serie
const MovieCard = ({ movie }) => {
  // Determina el tipo de medio (película o serie) basado en la presencia del título
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  
  // Obtiene la ruta de la imagen del perfil o del póster
  const imagePath = movie.profile_path || movie.poster_path;
  
  // Construye la URL completa de la imagen o usa una imagen por defecto si no hay imagen disponible
  const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w500/${imagePath}` : 'default_image_url_here'; // Reemplaza con una URL de imagen por defecto si no hay imagen

  return (
    <div className="movie-card">
      {/* Enlace a la página de detalles del medio */}
      <Link to={`/${mediaType}/${movie.id}`}>
        {/* Muestra la imagen del medio */}
        <img src={imageUrl} alt={movie.title || movie.name} />
      </Link>
      {/* Muestra el título o nombre del medio */}
      <h2>{movie.title || movie.name}</h2>
      {/* Muestra la fecha de lanzamiento o la primera fecha de emisión */}
      <p>{movie.release_date || movie.first_air_date}</p>
      {/* Muestra la valoración del medio */}
      <div className="rating">
        <span>⭐{movie.vote_average}</span> Valoración
      </div>
    </div>
  );
};

export default MovieCard;
