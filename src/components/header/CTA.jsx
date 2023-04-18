import React from 'react';
import CV from '../../assets/CV.pdf';

const CTA = () => {
  return (
    <div className="cta">
      <a href={CV} download className="btn">
      Télécharger CV
      </a>
      {/* <a href="#contact" className="btn btn-primary">
      Parlons
      </a> */}

<a className='btn-G' href="#contact">
  <strong>Parlons</strong>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div class="circle"></div>
    <div class="circle"></div>
  </div>
</a>
  



    </div>
  );
};

export default CTA;
