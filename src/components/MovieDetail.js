import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

// Componente para mostrar los detalles de una película o serie
const MovieDetail = ({ data }) => {
  // Obtener el tipo (película o serie) y el ID de los parámetros de la URL
  const { type, id } = useParams();
  // Estado para guardar los detalles de la película o serie
  const [details, setDetails] = useState(data || null);
  // Estado para guardar el enlace del trailer
  const [trailer, setTrailer] = useState(null);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Hook de ubicación de React Router para detectar cambios en la URL
  const location = useLocation();

  // Efecto para obtener los detalles de la película o serie si no se pasan como props
  useEffect(() => {
    if (!data) {
      const fetchDetails = async () => {
        try {
          // Realizar una solicitud GET a la API de TMDB para obtener los detalles de la película o serie
          const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // Obtener la API key desde las variables de entorno
              language: 'es-ES', // Idioma de la respuesta
              append_to_response: 'credits,videos', // Incluir los créditos y videos en la respuesta
            },
          });
          // Guardar los detalles en el estado
          setDetails(response.data);
          // Buscar y guardar el enlace del trailer en el estado si está disponible
          if (response.data.videos && response.data.videos.results.length > 0) {
            const trailerVideo = response.data.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            setTrailer(trailerVideo ? `https://www.youtube.com/embed/${trailerVideo.key}` : null);
          }
        } catch (err) {
          // Manejar errores y guardarlos en el estado
          setError(err);
          console.error(err);
        }
      };
      fetchDetails();
    }
  }, [type, id, data, location]);

  // Mostrar un mensaje de error si ocurre un error
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  // Mostrar un mensaje de carga mientras se obtienen los detalles
  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-detail-card">
        {/* Mostrar la imagen de la película o serie */}
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="movie-detail-img"
        />
        <div className="movie-detail-content">
          {/* Mostrar el título de la película o serie */}
          <h2>{details.title || details.name}</h2>
          {/* Mostrar la fecha de lanzamiento de la película o serie */}
          <p><strong>Fecha de lanzamiento:</strong> {details.release_date || details.first_air_date}</p>
          {/* Mostrar los géneros de la película o serie */}
          <p><strong>Géneros:</strong> {details.genres.map(genre => genre.name).join(', ')}</p>
          {/* Mostrar la sinopsis de la película o serie */}
          <p><strong>Sinopsis:</strong> {details.overview}</p>
          {/* Mostrar el reparto principal de la película o serie */}
          <p><strong>Reparto:</strong> {details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
        </div>
      </div>
      {trailer && (
        <div className="movie-detail-trailer">
          {/* Mostrar el trailer de la película o serie si está disponible */}
          <h3>Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={trailer}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
