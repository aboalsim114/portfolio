import React,{useEffect} from 'react'
import Fade from 'react-reveal/Fade';



const Intro = () => {
 


  return(
    <>
<div id="intro" className="section dark1">


  <div className="container">
  
    <div className="section-flex intro">
    <Fade left>
      <div className="section-left">
        <img src="/images/intro.svg" alt="intro" />
        
      </div>
    </Fade>
      
      <Fade right>
      <div className="section-right">
        
        <p className="weight-light">Bonjour Je suis </p>
        <h1 className="color-primary"> SAMI</h1>
        <h3 className="color-white">Développeur Full Stack</h3>
        <p><span className="color-primary"></span> <span className="color-primary">#</span>Express <span className="color-primary">#</span>React <span className="color-primary">#</span>Node</p>
      </div>
    </Fade>
    </div>
  </div>
  
</div>
    </>
  )
}

export default Intro;