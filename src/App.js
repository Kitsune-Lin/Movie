import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Movies from './components/Movies';
import MovieDetail from './components/MovieDetail';
import PersonDetail from './components/PersonDetail';
import './App.css';
import { getPopularMovies, getPopularSeries, getAllMovies, getAllSeries, searchAll } from './api';

const App = () => {
  // Estado para guardar las películas y series más populares
  const [trending, setTrending] = useState([]);
  // Estado para guardar todas las películas
  const [movies, setMovies] = useState([]);
  // Estado para guardar todas las series
  const [tvShows, setTvShows] = useState([]);
  // Estado para guardar los datos filtrados (resultados de búsqueda)
  const [filteredData, setFilteredData] = useState([]);
  // Estado para determinar el tipo de filtro actual (películas, series o todo)
  const [filterType, setFilterType] = useState('all');
  // Estado para manejar la paginación
  const [page, setPage] = useState(1);
  // Estado para manejar si se está realizando una búsqueda
  const [searching, setSearching] = useState(false);
  // Estado para guardar la consulta de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Hook de React Router para obtener la ubicación actual
  const location = useLocation();

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

  // Hook para obtener las películas y series más populares al cargar el componente
  useEffect(() => {
    fetchTrending();
  }, []);

  // Hook para manejar los cambios en el filtro y la búsqueda
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

  // Hook para manejar la paginación y la búsqueda
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

  // Hook para actualizar los datos filtrados cuando cambian los filtros o la búsqueda
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

  // Hook para manejar los cambios en la ubicación
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

  // Rutas
  return (
    <>
      <Navbar onSearch={handleSearch} resetSearch={resetSearch} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              {searching ? <h1 className="search-title">Estos son los resultados de búsqueda...</h1> :
              filterType === 'all' && <h1 className="home-title">LAS PELÍCULAS Y SERIES MÁS POPULARES DEL MOMENTO</h1>}
              <Movies data={filteredData} fetchMore={fetchMore} type={filterType} />
            </>
          } />
          <Route path="/movies" element={
            <>
              <h1 className="page-title">TODAS LAS PELÍCULAS</h1>
              <Movies data={filteredData.length ? filteredData : movies} fetchMore={fetchMore} type="movie" />
            </>
          } />
          <Route path="/series" element={
            <>
              <h1 className="page-title">TODAS LAS SERIES</h1>
              <Movies data={filteredData.length ? filteredData : tvShows} fetchMore={fetchMore} type="tv" />
            </>
          } />
          <Route path="/:type/:id" element={<MovieDetail onSearch={handleSearch} resetSearch={resetSearch} />} />
          <Route path="/person/:id" element={<PersonDetail onSearch={handleSearch} resetSearch={resetSearch} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
