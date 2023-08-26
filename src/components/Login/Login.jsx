import React,{useState,useEffect} from 'react';
import './Login.css';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import jwt from "jsonwebtoken"; // Add this line

export default function Login() {

  const navigate = useNavigate()

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errorMsg , setEerrorMsg] = useState([])
    const [successMsg , setSuccessMsg] = useState([])
    const [loading , setLoading] = useState(false);

    const setCookie = (name, value, days) => {
      let expires = "";
      if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const data = {
        username: username,
        password: password,
      };
      let url = "http://localhost:8000/api/users/login/";
      try {
        const response = await axios.post(url, data);
        if (response.status === 200 && response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.user.username);
          localStorage.setItem('userid', response.data.user.id);
          localStorage.setItem('isAdmin', response.data.user.is_superuser);
          localStorage.setItem("derniere_connexion", response.data.user.last_login)
          setSuccessMsg("Login successful!");
          if(response.data.user.is_superuser)
          {
            navigate(`/Dashboard/${response.data.user.id}`);
            
          }
          else{
            navigate("/blog");
          }
        } else {
          setEerrorMsg("Invalid login credentials.");
        }
      } catch (error) {
        setEerrorMsg(error.response.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-sm-6 col-md-4 col-md-offset-4">
        
          <div className="account-wall">
            <img className="profile-img" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Profile" />
            <form onSubmit={handleSubmit} method='POST' className="form-signin">
              <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value) } placeholder="username" required />
              
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="**********" required />
               
              
              <input  className="btn btn-lg btn-primary btn-block" type="submit" value="Connexion" />
            
             
              <span className="clearfix">

              <p style={{color: "red"}}> {errorMsg} </p>
              <p style={{textAlign: "center"}}> Vous n'avez pas encore de compte ? <Link to="/inscription">S'inscrire</Link> </p>

              </span>
            </form>
          </div>
       
        </div>
      </div>
    </div>
  );
}
