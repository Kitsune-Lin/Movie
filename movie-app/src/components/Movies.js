import React from 'react';
import MovieCard from './MovieCard';
import './Movies.css';

const Movies = ({ data }) => {
  return (
    <div className="movies-container">
      {data.map(item => (
        <MovieCard key={item.id} movie={item} />
      ))}
    </div>
  );
};

export default Movies;
