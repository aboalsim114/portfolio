import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import Blog from "./components/Blog/Blog"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx"
import PrivateRoute from "./utils/PrivateRoute.jsx"
import Dashboard from "./components/Admin/Dashboard"
import NotFound from "./components/NotFound/notFound"
import AddArticle from './components/Admin/AddArticle';
import Article from './components/Blog/Article/Article';
import EditArticle from './components/Admin/editArticle';
import Inscription from './components/Inscription/Inscription';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>

      <Route path="/" element={<App/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/connexion" element={<Login/>} />
      <Route path="/inscription" element={<Inscription/>} />
      <Route path='*' exact={true} element={<NotFound/>} />
      <Route path='/article/:article_id'  element={<Article/>} />
      <Route element={<PrivateRoute/>}>
      <Route path="/editArticle/:article_id" element={<EditArticle />} />
      <Route path="/AddArticle/" element={<AddArticle />}  />
      <Route path="/Dashboard/:userid" element={<Dashboard />}  />
      </Route>

      </Routes>
    </Router>
 
  </React.StrictMode>
);

