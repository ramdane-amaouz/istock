import './App.css'
import logo from './assets/istock-logo.svg';

import Menu from './components/Menu.jsx'
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Article from './pages/Article.jsx';
import AjouterArticle from './pages/AjouterArticle.jsx';
import Employer from './pages/Employer.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';    // ← à importer
import PrivateRoute from './components/PrivateRoute.jsx';
import AjouterEmploye from './pages/AjouterEmploye.jsx';

import { API_URL } from "./api";





function App() {
  return (
    <>
      <header>
        <div>
          <img src={logo} alt="iStock Logo" width={700}/>
        </div>
        <h1>🚀 Bienvenue sur iStock, votre gestion de stock en toute simplicité !</h1>
        <Menu />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ← la nouvelle route */}

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/article"
            element={
              <PrivateRoute>
                <Article />
              </PrivateRoute>
            }
          />
          <Route
            path="/ajouter-article"
            element={
              <PrivateRoute>
                <AjouterArticle />
              </PrivateRoute>
            }
          />
          <Route
  path="/employer"
  element={
    <PrivateRoute adminOnly={true}>
      <Employer />
    </PrivateRoute>
  }
/>

           <Route
          path="/ajouter-employe"
          element={
            <PrivateRoute adminOnly={true}>
              <AjouterEmploye />
            </PrivateRoute>
          }
        />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            }
          />
        </Routes>
       

      </header>
    </>
  );
}

export default App;
