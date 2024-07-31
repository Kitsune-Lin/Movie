import React, { useState, useEffect } from 'react'; // Importa React y los hooks necesarios
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom para la navegación
import './TrendingCarousel.css'; // Importa los estilos CSS específicos para el carrusel
import { getPopularMovies, getPopularSeries } from '../api'; // Importa funciones para obtener datos de la API

const TrendingCarousel = () => {
  const [trending, setTrending] = useState([]); // Estado para almacenar las películas y series más populares
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para almacenar el índice actual del carrusel

  // Efecto para obtener los datos más populares al montar el componente
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Realiza solicitudes para obtener las películas y series más populares
        const [moviesResponse, seriesResponse] = await Promise.all([getPopularMovies(), getPopularSeries()]);
        // Combina los datos de películas y series en un solo array
        const combinedData = [...moviesResponse.data.results, ...seriesResponse.data.results];
        setTrending(combinedData); // Actualiza el estado con los datos combinados
      } catch (error) {
        console.error('Error fetching trending data: ', error); // Maneja errores en la solicitud
      }
    };
    fetchTrending(); // Llama a la función para obtener los datos
  }, []);

  // Efecto para cambiar el elemento actual del carrusel cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length); // Incrementa el índice de forma circular
    }, 10000); // Cambia cada 10 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [trending]);

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (!trending.length) return <div>Loading...</div>;

  const currentItem = trending[currentIndex]; // Obtiene el elemento actual del carrusel

  return (
    <div className="carousel">
      <div
        className="carousel-background"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentItem.backdrop_path})` }}
      >
        <div className="carousel-content">
          <h1>{currentItem.title || currentItem.name}</h1> {/* Muestra el título o nombre del elemento */}
          <p>{currentItem.overview}</p> {/* Muestra la descripción del elemento */}
          <Link to={`/${currentItem.media_type || 'movie'}/${currentItem.id}`} className="info-button">
            Más información
          </Link> {/* Enlace a la página de detalles del elemento */}
        </div>
      </div>
    </div>
  );
};

export default TrendingCarousel; // Exporta el componente para su uso en otros archivos
