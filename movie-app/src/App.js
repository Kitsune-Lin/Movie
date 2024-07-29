import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Movies from './components/Movies';
import MovieDetail from './components/MovieDetail';
import './App.css';
import { getPopularMovies, getPopularSeries } from './api'; // Asegúrate de importar las funciones

const App = () => {
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchTrending = async () => {
      const response = await getPopularMovies();
      setTrending(response.data.results);
      setFilteredData(response.data.results);
    };

    const fetchMovies = async (page = 1) => {
      const response = await getPopularMovies(page);
      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...response.data.results]);
      }
    };

    const fetchTvShows = async (page = 1) => {
      const response = await getPopularSeries(page);
      if (page === 1) {
        setTvShows(response.data.results);
      } else {
        setTvShows(prevTvShows => [...prevTvShows, ...response.data.results]);
      }
    };

    fetchTrending();
    fetchMovies();
    fetchTvShows();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredData(trending);
    } else if (filterType === 'movie') {
      setFilteredData(movies);
    } else if (filterType === 'tv') {
      setFilteredData(tvShows);
    }
  }, [filterType, trending, movies, tvShows]);

  const handleSearch = (query) => {
    let allData = [];
    if (filterType === 'all') {
      allData = trending;
    } else if (filterType === 'movie') {
      allData = movies;
    } else if (filterType === 'tv') {
      allData = tvShows;
    }

    if (query.trim() === '') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(item =>
        (item.title && item.title.toLowerCase().includes(query.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
        (item.overview && item.overview.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const fetchMore = (page) => {
    const fetchMovies = async (page = 1) => {
      const response = await getPopularMovies(page);
      return response.data.results;
    };
  
    const fetchTvShows = async (page = 1) => {
      const response = await getPopularSeries(page);
      return response.data.results;
    };
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <div className="app-container">
        <div className="button-container">
          <button className="filter-button" onClick={() => handleFilter('all')}>HOME</button>
          <button className="filter-button" onClick={() => handleFilter('movie')}>PELICULAS</button>
          <button className="filter-button" onClick={() => handleFilter('tv')}>SERIES</button>
        </div>
        <Routes>
          <Route path="/" element={
            <>
              {filterType === 'all' && <h1 className="home-title">LAS PELÍCULAS Y SERIES MÁS POPULARES DEL MOMENTO</h1>}
              <Movies data={filteredData} fetchMore={fetchMore} />
            </>
          } />
          <Route path="/movies" element={<Movies data={filteredData} fetchMore={fetchMore} />} />
          <Route path="/series" element={<Movies data={filteredData} fetchMore={fetchMore} />} />
          <Route path="/:type/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
