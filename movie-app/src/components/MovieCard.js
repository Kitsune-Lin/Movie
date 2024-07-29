import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  return (
    <div className="movie-card">
      <Link to={`/${mediaType}/${movie.id}`}>
        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title || movie.name} />
      </Link>
      <h2>{movie.title || movie.name}</h2>
      <p>{movie.release_date || movie.first_air_date}</p>
      
      <div className="rating">
        <span>⭐{movie.vote_average}</span> Valoración
      </div>
      <div>
        
      </div>
    </div>
    
  );
};

export default MovieCard;
