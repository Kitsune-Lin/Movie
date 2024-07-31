import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey,
  },
});

// Nueva función para obtener las peliculas del momento
export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', {
    params: {
      language: 'es-ES',
      page: page,
    },
  });
};

// Nueva función para obtener las series del momento
export const getPopularSeries = (page = 1) => {
  return api.get('/tv/popular', {
    params: {
      language: 'es-ES',
      page: page,
    },
  });
};

// Nueva función para obtener las peliculas
export const getAllMovies = (page = 1) => {
  return api.get('/discover/movie', {
    params: {
      language: 'es-ES',
      sort_by: 'popularity.desc',
      page: page,
    },
  });
};

// Nueva función para obtener las series
export const getAllSeries = (page = 1) => {
  return api.get('/discover/tv', {
    params: {
      language: 'es-ES',
      sort_by: 'popularity.desc',
      page: page,
    },
  });
};

// Nueva función para buscar películas, series y actores
export const searchAll = (query, page = 1) => {
  return api.get('/search/multi', {
    params: {
      language: 'es-ES',
      query: query,
      page: page,
    },
  });
};

export default api;
