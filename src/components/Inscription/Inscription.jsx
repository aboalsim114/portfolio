
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Inscription.css"
import { useNavigate } from 'react-router-dom';
export default function Inscription() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user_image, setUser_image] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


   
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('user_image', user_image);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('username', username);

      let url = "http://127.0.0.1:8000/api/users/register/";
      try {
          const response = await axios.post(url, formData);
          if (response.status < 300) {
              setSuccessMessage("Inscription réussie");
              navigate("/connexion");
          } else {
              setErrorMessage(response.data.message);
          }
      } catch (err) {
          console.log(err);
      }
  }


  return (
<section className="testimonial py-5" id="testimonial">
    <div className="container">
        <div className="row ">
            <div className="col-md-4 py-5 bg-primary text-white text-center ">
                <div className=" ">
                    <div className="card-body">
                        <h2 className="py-3">Inscription</h2>
                        <p>Merci de remplir ce formulaire pour vous inscrire </p>
                    </div>
                </div>
            </div>
            <div className="col-md-8 py-5 border">
                <h4 className="pb-4">Veuillez remplir avec vos détails</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                          <input id="Full Name" name="Full Name" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="votre pseudo" className="form-control" type="text" />
                        </div>
                        <div className="form-group col-md-6">
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="inputEmail4" placeholder="Email" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" placeholder="**********" className="form-control" required type="password" />
                        </div>
                        <div className="form-group col-md-6">
                        <div class="custom-file">
                        <input onChange={(e) => setUser_image(e.target.files[0])} type="file" className="custom-file-input" id="customFileLang" lang="fr" />
                <label className="custom-file-label" htmlFor="customFileLang">Sélectionner une image</label>

</div>                        </div>
                   
                    </div>
               
                    <div className="form-row">
                        <button type="submit"  className="btn btn-danger text-white">cree mon compte</button>
                    </div>
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                </form>
            </div>
        </div>
    </div>
</section>


  )
}
