import React,{useState} from 'react'
import Fade from 'react-reveal/Fade';

const Contact = () => {
  const [nom, setNom] = useState("")
  const [email , setEmail] = useState("")
  const [portable,setPortable] = useState("")
  const [msg , setMsg] = useState("")

  const formSubmitHandler = (event) => {
  event.preventDefault();
  let name = document.getElementById("name")
  if(name.value === ""){
    name.classList.add("empty")
  }

  }
  return (
    <div id="contact" className="section dark2">
      <div className="container contact">
        <Fade bottom>
        <div className="section-title">
          <h1>Contact <span className="color-primary">Moi</span></h1>
          <p className="width70">N'hésitez pas à me contacter. Je suis toujours ouvert pour discuter de nouveaux projets, d'idées créatives ou d'opportunités.</p>
        </div>
        </Fade>
        <div>
          <ul className="social-icons">
            <li><a href="https://github.com/aboalsim114" target="_blank" rel="noreferrer"><i className="bi bi-github"></i></a></li>
            <li><a href="https://www.linkedin.com/in/sami-abdulhalim/"  target="_blank" rel="noreferrer"><i className="bi bi-linkedin "></i></a></li>
            <li><a href="/"  target="_blank" rel="noreferrer"><i className="bi bi-whatsapp"></i></a></li>
          </ul>
        </div>
        <div className="columns">
          <Fade right>
          <div className="column contact-box">
            <h3>Adresse</h3>
            <i className="bi bi-map icon"></i>
            <p>ile de france<br />Paris, 75</p>
          </div>
          </Fade>
          <Fade right>
          <div className="column contact-box">
          <h3>Email</h3>
          <i className="bi bi-envelope icon"></i>
          <p>sami.abdulhalim@hetic.net</p>
          </div>
          </Fade>
          <Fade left>
          <div className="column contact-box">
          <h3>Appelle-moi</h3>
          <i className="bi bi-telephone-inbound icon"></i>
          </div>
          </Fade>
        </div>

        <div>
          <form className="contact-form" method='post' onSubmit={formSubmitHandler}>
            <input value={nom}  onChange={(e) => setNom(e.target.value)} type="text" id="name" name="name" placeholder="Votre Nom" />
            <input type="text" value={portable} onChange={(e) => setPortable(e.target.value) } id="phone" name="phone" placeholder="Votre Numero portable" />
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Votre mail" />
            <textarea rows="5" id="message" name="message" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder=" message" />
            <button type="submit" className="button">Envoyer le Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact;