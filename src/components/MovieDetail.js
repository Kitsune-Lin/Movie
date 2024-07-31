import React, { useState, useEffect } from 'react'; // Importa React y hooks necesarios desde la librería react
import { useParams, useLocation, Link } from 'react-router-dom'; // Importa hooks y componentes de react-router-dom para manejar la navegación y obtener parámetros de la URL
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import './MovieDetail.css'; // Importa los estilos CSS específicos para este componente

const MovieDetail = ({ data }) => {
  const { type, id } = useParams(); // Obtiene los parámetros de la URL (tipo de media y ID)
  const [details, setDetails] = useState(data || null); // Estado para almacenar los detalles de la película o serie
  const [trailer, setTrailer] = useState(null); // Estado para almacenar la URL del tráiler de YouTube
  const [error, setError] = useState(null); // Estado para manejar posibles errores
  const location = useLocation(); // Hook para obtener la ubicación actual, útil para detectar cambios en la URL

  // Hook useEffect para obtener los detalles de la película o serie cuando el componente se monta o cuando cambian el tipo o ID
  useEffect(() => {
    if (!data) { // Solo realiza la solicitud si no hay datos previos
      const fetchDetails = async () => {
        try {
          // Realiza una solicitud GET a la API de TMDB para obtener los detalles de la película o serie
          const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // La clave de API se obtiene de las variables de entorno
              language: 'es-ES', // Define el idioma de la respuesta
              append_to_response: 'credits,videos', // Incluye los créditos y videos en la respuesta
            },
          });
          setDetails(response.data); // Guarda los detalles obtenidos en el estado
          // Busca y guarda el tráiler de YouTube si está disponible
          if (response.data.videos && response.data.videos.results.length > 0) {
            const trailerVideo = response.data.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            setTrailer(trailerVideo ? `https://www.youtube.com/embed/${trailerVideo.key}` : null);
          }
        } catch (err) { // Manejo de errores en la solicitud
          setError(err);
          console.error(err);
        }
      };
      fetchDetails();
    }
  }, [type, id, data, location]); // El efecto se ejecuta cuando cambian estos valores

  // Renderiza un mensaje de error si hay algún problema con la solicitud
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  // Renderiza un mensaje de carga mientras se obtienen los detalles
  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-detail-card">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} // URL de la imagen del poster
          alt={details.title || details.name} // Texto alternativo para la imagen
          className="movie-detail-img" // Clase CSS para estilizar la imagen
        />
        <div className="movie-detail-content">
          <h2>{details.title || details.name}</h2> {/* Título o nombre de la película o serie */}
          <p><strong>Fecha de lanzamiento:</strong> {details.release_date || details.first_air_date}</p> {/* Fecha de lanzamiento */}
          <p><strong>Géneros:</strong> {details.genres.map(genre => genre.name).join(', ')}</p> {/* Lista de géneros */}
          <p><strong>Sinopsis:</strong> {details.overview}</p> {/* Sinopsis */}
          <p><strong>Reparto:</strong> {details.credits.cast.slice(0, 5).map(actor => ( // Muestra los primeros 5 actores del reparto
            <Link key={actor.id} to={`/person/${actor.id}`} className="actor-link">{actor.name}</Link> // Enlace al detalle de cada actor
          )).reduce((prev, curr) => [prev, ', ', curr])}</p>
        </div>
      </div>
      {trailer && ( // Muestra el tráiler si está disponible
        <div className="movie-detail-trailer">
          <h3>Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={trailer} // URL del tráiler
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
