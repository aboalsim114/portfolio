import React from 'react'
import Header from './Header';
import Intro from './Intro';
import "../css/style.css"
import Services from './Services/Services';
import About from './About';
import Contact from './Contact';
import Portfolio from './Portfolio/Portfolio'
export default function Home() {
  return (
    <div>
        <Header/>
        <Intro/>
        <About/>
        <Services/>
       
        <Contact/>
    </div>
  )
}
