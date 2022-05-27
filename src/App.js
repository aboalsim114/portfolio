import React from 'react'
import './css/bootstrap-icons.css'
import Home from './components/Home'
import AnimatedCursor from "react-animated-cursor"
import Admin from "./Admin/Admin"
import Notfound from "./NotFound"
import "./css/style.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {

  return (  
    <Router>
    <div>
      <AnimatedCursor
         innerSize={20}
         outerSize={10}
         color='153, 153, 255'
         outerAlpha={0.2}
         innerScale={0.7}
         outerScale={5}
         
         />
    </div>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<Notfound/>} />
      <Route path="/aboalsim" element={<Admin/>} />
      
    </Routes>
         </Router>
    
         
   
     
      
      
       

      

  );
}

export default App;
