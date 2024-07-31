import React, { useState, useEffect } from 'react'; // Importa React y los hooks necesarios
import { Route, Routes, useLocation } from 'react-router-dom'; // Importa componentes y hooks de react-router-dom
import Navbar from './components/Navbar'; // Importa el componente Navbar
import Movies from './components/Movies'; // Importa el componente Movies
import MovieDetail from './components/MovieDetail'; // Importa el componente MovieDetail
import PersonDetail from './components/PersonDetail'; // Importa el componente PersonDetail
import TrendingCarousel from './components/TrendingCarousel'; // Importa el componente TrendingCarousel
import './App.css'; // Importa los estilos CSS globales
import { getPopularMovies, getPopularSeries, getAllMovies, getAllSeries, searchAll } from './api'; // Importa funciones para obtener datos de la API

const App = () => {
  const [trending, setTrending] = useState([]); // Estado para almacenar las películas y series más populares
  const [movies, setMovies] = useState([]); // Estado para almacenar todas las películas
  const [tvShows, setTvShows] = useState([]); // Estado para almacenar todas las series
  const [filteredData, setFilteredData] = useState([]); // Estado para almacenar los datos filtrados (resultado de búsqueda)
  const [filterType, setFilterType] = useState('all'); // Estado para almacenar el tipo de filtro (películas, series o todo)
  const [page, setPage] = useState(1); // Estado para manejar la paginación
  const [searching, setSearching] = useState(false); // Estado para manejar si se está realizando una búsqueda
  const [searchQuery, setSearchQuery] = useState(''); // Estado para almacenar la consulta de búsqueda

  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para obtener todas las películas con paginación
  const fetchAllMovies = async (page = 1) => {
    try {
      const response = await getAllMovies(page);
      if (response && response.data) {
        setMovies(prevMovies => page === 1 ? response.data.results : [...prevMovies, ...response.data.results]);
      }
    } catch (error) {
      console.error("Error fetching all movies: ", error);
    }
  };

  // Función para obtener todas las series con paginación
  const fetchAllSeries = async (page = 1) => {
    try {
      const response = await getAllSeries(page);
      if (response && response.data) {
        setTvShows(prevTvShows => page === 1 ? response.data.results : [...prevTvShows, ...response.data.results]);
      }
    } catch (error) {
      console.error("Error fetching all series: ", error);
    }
  };

  // Función para obtener las películas y series más populares
  const fetchTrending = async () => {
    try {
      const [moviesResponse, seriesResponse] = await Promise.all([getPopularMovies(), getPopularSeries()]);
      const combinedData = [...moviesResponse.data.results, ...seriesResponse.data.results];
      setTrending(combinedData);
      setFilteredData(combinedData);
    } catch (error) {
      console.error("Error fetching trending data: ", error);
    }
  };

  // Función para realizar una búsqueda en la API
  const performSearch = async (query, page = 1) => {
    try {
      const response = await searchAll(query, page);
      if (response && response.data) {
        setFilteredData(prevData => page === 1 ? response.data.results : [...prevData, ...response.data.results]);
      }
    } catch (error) {
      console.error("Error searching data: ", error);
    }
  };

  // Efecto para obtener los datos más populares al montar el componente
  useEffect(() => {
    fetchTrending();
  }, []);

  // Efecto para obtener todas las películas o series dependiendo del filtro y si no se está buscando
  useEffect(() => {
    if (!searching) {
      if (filterType === 'movie') {
        fetchAllMovies(1);
      } else if (filterType === 'tv') {
        fetchAllSeries(1);
      } else {
        setFilteredData(trending);
      }
    }
  }, [filterType, searching]);

  // Efecto para realizar la búsqueda o la paginación
  useEffect(() => {
    if (searching) {
      performSearch(searchQuery, page);
    } else {
      if (filterType === 'movie') {
        fetchAllMovies(page);
      } else if (filterType === 'tv') {
        fetchAllSeries(page);
      }
    }
  }, [page, searching]);

  // Efecto para actualizar los datos filtrados cuando cambia el tipo de filtro, las películas, las series o los datos populares
  useEffect(() => {
    if (!searching) {
      if (filterType === 'all') {
        setFilteredData(trending);
      } else if (filterType === 'movie') {
        setFilteredData(movies);
      } else if (filterType === 'tv') {
        setFilteredData(tvShows);
      }
    }
  }, [filterType, trending, movies, tvShows, searching]);

  // Efecto para manejar los cambios en la ubicación
  useEffect(() => {
    if (location.pathname === '/movies') {
      setFilterType('movie');
      setPage(1);
      fetchAllMovies(1);
    } else if (location.pathname === '/series') {
      setFilterType('tv');
      setPage(1);
      fetchAllSeries(1);
    } else {
      setFilterType('all');
      setPage(1);
      setFilteredData(trending);
    }
    setSearching(false);
  }, [location]);

  // Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearching(true);
    setPage(1);
    performSearch(query, 1);
  };

  // Función para reiniciar la búsqueda
  const resetSearch = () => {
    setSearching(false);
    setSearchQuery('');
    setPage(1);
    fetchTrending();
  };

  // Función para cargar más datos (paginación)
  const fetchMore = async () => {
    setPage(prevPage => prevPage + 1);
  };

  // Renderiza las rutas y componentes
  return (
    <>
      <Navbar onSearch={handleSearch} resetSearch={resetSearch} /> {/* Navbar recibe las funciones de búsqueda y reinicio */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              {!searching && <TrendingCarousel />} {/* Muestra el carrusel solo si no se está buscando */}
              {searching ? <h1 className="search-title">Estos son los resultados de búsqueda...</h1> :
              filterType === 'all' && <h1 className="home-title">LAS PELÍCULAS Y SERIES MÁS POPULARES DEL MOMENTO</h1>}
              <Movies data={filteredData} fetchMore={fetchMore} type={filterType} /> {/* Muestra las películas o series */}
            </>
          } />
          <Route path="/movies" element={
            <>
              <h1 className="page-title">TODAS LAS PELÍCULAS</h1>
              <Movies data={filteredData.length ? filteredData : movies} fetchMore={fetchMore} type="movie" /> {/* Muestra todas las películas */}
            </>
          } />
          <Route path="/series" element={
            <>
              <h1 className="page-title">TODAS LAS SERIES</h1>
              <Movies data={filteredData.length ? filteredData : tvShows} fetchMore={fetchMore} type="tv" /> {/* Muestra todas las series */}
            </>
          } />
          <Route path="/:type/:id" element={<MovieDetail onSearch={handleSearch} resetSearch={resetSearch} />} /> {/* Detalle de la película */}
          <Route path="/person/:id" element={<PersonDetail onSearch={handleSearch} resetSearch={resetSearch} />} /> {/* Detalle de la persona */}
        </Routes>
      </div>
    </>
  );
};

export default App;
