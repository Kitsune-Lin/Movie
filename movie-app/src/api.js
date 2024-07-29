import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey,
  },
});

export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', {
    params: {
      language: 'es-ES',
      page: page,
    },
  });
};

export const getPopularSeries = (page = 1) => {
  return api.get('/tv/popular', {
    params: {
      language: 'es-ES',
      page: page,
    },
  });
};

export default api;
