import React,{useEffect} from 'react'
import Fade from 'react-reveal/Fade';

const About = () => {
 
  return (
    <div id="about" className="section dark2">
      
      <div className="container">
        <Fade bottom>

        <div className="section-title">
          <h1>About <span className="color-primary">Me</span></h1>
          <p className="width70">Je suis un développeur full stack. Je code et crée des éléments Web pour des personnes incroyables à travers le monde. </p>
        </div>
        </Fade>
        <div className="section-flex">
          <Fade left>
          <div className="section-left">
            <img className="myphoto" src="/images/sami.png" alt="myphoto" />
          </div>
          </Fade>
          <Fade right>
          <div className="section-right">
            <section >
              <h2 className="weight-light">Salut je suis <span className="color-primary">ABDULHALIM SAMI</span></h2>
              <p>Je suis un développeur full stack Je code et crée des sites Web, des services Web, et des boutiques en ligne élégants et modernes. Ma passion est de concevoir des expériences utilisateur numériques à travers des interactions significatives.</p>
            </section>
            <hr />
            <section>
              <h2 className="weight-light">Informations <span className="color-primary">personnelles</span></h2>
              <div>
                <p><strong>prenom:</strong>  SAMI</p>
                <p><strong>Age:</strong> 22 ans</p>
                <p><strong>Langues:</strong> anglais, francais</p>
                
                <p><strong>Alternance:</strong> Disponible</p>
              </div>
            </section>
          </div>
          </Fade>
        </div>
        <Fade bottom>

        <div className="columns">
          <div className="column">
            <h2 className="weight-light">My <span className="color-primary">Skills</span></h2>
            <section>HTML5, CSS3, SASS</section>
            <hr />
            <section>JavaScript, ReactJS, Express</section>
            <hr />
            <section>PHP, Python, Nodejs</section>
          </div>
         
          <div className="column">
            <h2 className="weight-light">My <span className="color-primary">Education</span></h2>
            <section><p>Baccalauréat technologique<br />Ecole Cned (2019-2020)</p>
            </section>
            <hr />
            <section><p>Hetic<br />la grande école du Web et des métiers du digital(2020-2023)</p>
            </section>
          </div>
        </div>
        </Fade>

      </div>

    </div>
  )
}

export default About;