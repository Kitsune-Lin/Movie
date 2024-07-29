import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

const MovieDetail = () => {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      console.log(`Fetching details for ${type}/${id}`);
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
          params: {
            api_key: '284355d6978efe1007b8b09e0add4a74',
            language: 'es-ES',
            append_to_response: 'credits',
          },
        });
        setDetails(response.data);
      } catch (err) {
        setError(err);
        console.error(err);
      }
    };

    fetchDetails();
  }, [type, id]);

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="movie-detail">
      
      <div className="movie-detail-card">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="movie-detail-img"
        />
        
        <div className="movie-detail-content">
          <h2>{details.title || details.name}</h2>
          <p><strong>Fecha de lanzamiento:</strong> {details.release_date || details.first_air_date}</p>
          <p><strong>Géneros:</strong> {details.genres.map(genre => genre.name).join(', ')}</p>
          <p><strong>Sinopsis:</strong> {details.overview}</p>
          <p><strong>Reparto:</strong> {details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
