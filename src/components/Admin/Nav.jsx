import React, { useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { BiAddToQueue } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { Link ,useParams,useNavigate} from 'react-router-dom';


import '../topbar/topbar.css';

const Nav = () => {
  const history = useNavigate()
    const userid = localStorage.getItem("userid").replace(/"/g, "");
    const [activeNav, setActiveNav] = useState('#home');


    const handleLogOut = (e) => {
      let auth = localStorage.getItem("token")

      if(auth)
      {
        localStorage.clear()
        window.location.reload();
      }

    }

  return (
    <nav>
<Link to={`/Dashboard/${userid}`} className={activeNav}><AiOutlineHome /></Link>
<Link to={`/AddArticle/${userid}`} className={activeNav}><BiAddToQueue /></Link>
<Link onClick={handleLogOut} className={activeNav}><BiLogOut /></Link>
      
    </nav>
  )
}

export default Nav;