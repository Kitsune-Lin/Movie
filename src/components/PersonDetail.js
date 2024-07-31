// Importamos las librerías necesarias de React y otras dependencias
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PersonDetail.css';

// Componente PersonDetail para mostrar los detalles de una persona (actor/actriz)
const PersonDetail = ({ data }) => {
  // Obtiene el parámetro `id` de la URL usando useParams de react-router-dom
  const { id } = useParams();
  // Define el estado `details` para almacenar los detalles de la persona y `error` para manejar errores
  const [details, setDetails] = useState(data || null);
  const [error, setError] = useState(null);
  // Obtiene la ubicación actual de la URL usando useLocation de react-router-dom
  const location = useLocation();

  // useEffect para buscar los detalles de la persona cuando el componente se monta o el `id` cambia
  useEffect(() => {
    if (!data) {
      const fetchDetails = async () => {
        try {
          // Hace una solicitud GET a la API de TMDB para obtener los detalles de la persona
          const response = await axios.get(`https://api.themoviedb.org/3/person/${id}`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // Clave de la API almacenada en variables de entorno
              language: 'es-ES', // Idioma de la respuesta
              append_to_response: 'movie_credits,tv_credits', // Incluye créditos de películas y TV en la respuesta
            },
          });
          // Actualiza el estado `details` con los datos recibidos
          setDetails(response.data);
        } catch (err) {
          // Manejo de errores y actualización del estado `error`
          setError(err);
          console.error(err);
        }
      };
      fetchDetails();
    }
  }, [id, data, location]); // Dependencias del efecto: `id`, `data`, `location`

  // Muestra un mensaje de error si ocurre un error durante la solicitud
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  // Muestra un mensaje de carga mientras se obtienen los detalles
  if (!details) {
    return <div>Loading...</div>;
  }

  // Renderiza los detalles de la persona, incluyendo sus películas y series
  return (
    <div className="person-detail">
      <div className="person-detail-card">
        {/* Imagen de perfil de la persona */}
        <img
          src={`https://image.tmdb.org/t/p/w500${details.profile_path}`}
          alt={details.name}
          className="person-detail-img"
        />
        <div className="person-detail-content">
          {/* Nombre de la persona */}
          <h2>{details.name}</h2>
          {/* Fecha de nacimiento */}
          <p><strong>Fecha de nacimiento:</strong> {details.birthday}</p>
          {/* Biografía */}
          <p><strong>Biografía:</strong> {details.biography}</p>
        </div>
      </div>
      <div className="person-credits">
        <h3>PELICULAS</h3>
        {/* Lista de películas en las que ha participado */}
        <div className="movie-list">
          {details.movie_credits.cast.map(movie => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-card-img"
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
        <h2>SERIES</h2>
        {/* Lista de series en las que ha participado */}
        <div className="movie-list">
          {details.tv_credits.cast.map(tv => (
            <div key={tv.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
                className="movie-card-img"
              />
              <p>{tv.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Exporta el componente PersonDetail para que pueda ser usado en otras partes de la aplicación
export default PersonDetail;
