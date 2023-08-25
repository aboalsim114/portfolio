import React,{useState,useEffect} from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt from "jsonwebtoken"; // Add this line

export default function Login() {

  const history = useNavigate()

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [errorMsg , setEerrorMsg] = useState([])
    const [successMsg , setSuccessMsg] = useState([])


    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = {
        email: email,
        password: password,
      };
      let url = "http://localhost:8000/api/users/";
      try {
        const response = await axios.post(url, data);
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          setSuccessMsg("Login successful!");
          navigate('/dashboard'); // Redirect to dashboard or home page
        } else {
          setEerrorMsg("Invalid login credentials.");
        }
      } catch (error) {
        setEerrorMsg(error.response.data.message || "An error occurred.");
      }
    };a
    


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-sm-6 col-md-4 col-md-offset-4">
        
          <div className="account-wall">
            <img className="profile-img" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Profile" />
            <form onSubmit={handleSubmit} method='POST' className="form-signin">
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value) } placeholder="Email" required />
              
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="**********" required />
               
              
              <input  className="btn btn-lg btn-primary btn-block" type="submit" value="Connexion" />
            
             
              <span className="clearfix">

              <p style={{color: "red"}}> {errorMsg} </p>

              </span>
            </form>
          </div>
       
        </div>
      </div>
    </div>
  );
}
