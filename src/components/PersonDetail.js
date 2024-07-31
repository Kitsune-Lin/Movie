import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PersonDetail.css';

// Componente para mostrar los detalles de una persona (actor/actriz)
const PersonDetail = ({ data }) => {
  // Obtener el ID de la persona desde los parámetros de la URL
  const { id } = useParams();
  // Estado para guardar los detalles de la persona
  const [details, setDetails] = useState(data || null);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Hook de ubicación de React Router para detectar cambios en la URL
  const location = useLocation();

  // Efecto para obtener los detalles de la persona si no se pasan como props
  useEffect(() => {
    if (!data) {
      const fetchDetails = async () => {
        try {
          // Realizar una solicitud GET a la API de TMDB para obtener los detalles de la persona
          const response = await axios.get(`https://api.themoviedb.org/3/person/${id}`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // Obtener la API key desde las variables de entorno
              language: 'es-ES', // Idioma de la respuesta
              append_to_response: 'movie_credits,tv_credits', // Incluir los créditos de películas y TV en la respuesta
            },
          });
          // Guardar los detalles en el estado
          setDetails(response.data);
        } catch (err) {
          // Manejar errores y guardarlos en el estado
          setError(err);
          console.error(err);
        }
      };
      fetchDetails();
    }
  }, [id, data, location]);

  // Mostrar un mensaje de error si ocurre un error
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  // Mostrar un mensaje de carga mientras se obtienen los detalles
  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="person-detail">
      <div className="person-detail-card">
        {/* Mostrar la imagen de perfil de la persona */}
        <img
          src={`https://image.tmdb.org/t/p/w500${details.profile_path}`}
          alt={details.name}
          className="person-detail-img"
        />
        <div className="person-detail-content">
          {/* Mostrar el nombre de la persona */}
          <h2>{details.name}</h2>
          {/* Mostrar la fecha de nacimiento de la persona */}
          <p><strong>Fecha de nacimiento:</strong> {details.birthday}</p>
          {/* Mostrar la biografía de la persona */}
          <p><strong>Biografía:</strong> {details.biography}</p>
          <h3>Películas</h3>
          {/* Mostrar una lista de películas en las que ha participado la persona */}
          <ul>
            {details.movie_credits.cast.map(movie => (
              <li key={movie.id}>{movie.title} ({movie.character})</li>
            ))}
          </ul>
          <h3>Series</h3>
          {/* Mostrar una lista de series en las que ha participado la persona */}
          <ul>
            {details.tv_credits.cast.map(tv => (
              <li key={tv.id}>{tv.name} ({tv.character})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;
