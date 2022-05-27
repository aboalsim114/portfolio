import React from 'react';
import { useNavigate } from "react-router-dom";
import ErrorPage from './images/ErrorPage.gif'
const Notfound = () => {
    let navigate = useNavigate();
    setTimeout(() => {navigate("/")}, 8000)
    return (
        <div className="NotFound">
            
            <img src={ErrorPage} alt="" />
        </div>
    );
}

export default Notfound;
