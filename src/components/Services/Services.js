import React from 'react'
import Service from './Service'
import {ServicesData} from './ServicesData'
import Fade from 'react-reveal/Fade';

const Services = () => {
  return (
    <div id="services" className="section dark1">
      <div className="container">
        <Fade bottom>

        <div className="section-title">
          <h1>My <span className="color-primary">Services</span></h1>
          <p className="width70">Je conçois et développe des services pour des clients de toutes tailles, spécialisés dans la création de sites Web, d'applications mobiles, de services Web et de boutiques en ligne élégants et modernes.</p>
        </div>
        </Fade>
        <div className="columns">
          {ServicesData.map(item => (
            <Service key={item.id} title={item.title} icon={item.icon}  />
          ))}
          
        </div>
      </div>
    </div>
  )
}

export default Services;