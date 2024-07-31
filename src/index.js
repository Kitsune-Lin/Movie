import React from 'react'; // Importa React para utilizar JSX
import ReactDOM from 'react-dom'; // Importa ReactDOM para renderizar el componente React en el DOM
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter de React Router para manejar la navegación en la aplicación
import App from './App'; // Importa el componente principal de la aplicación
import './index.css'; // Importa los estilos globales

// Renderiza el componente principal de la aplicación dentro del elemento con id 'root'
// Utiliza el Router para manejar la navegación entre diferentes rutas en la aplicación
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
