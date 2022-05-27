import React,{useState} from 'react'
import "./Admin.css"
export default function Admin() {
  const [AddSkill, setAddSkill] = useState("")
  return (
    <div className="grid-container">
    <div className="menu-icon">
     <i className="fas fa-bars header__menu"></i>
   </div>
    
   <header className="header">
     <div className="header__search">
       <input id="search" type="search"/>
     </div>
     
   </header>
 
   <aside className="sidenav">
     <div className="sidenav__close-icon">
       <i className="fas fa-times sidenav__brand-close"></i>
     </div>
     <ul className="sidenav__list">
       
       <li className="sidenav__list-item">Dashboard</li>
       <li className="sidenav__list-item">Item Two</li>
       <li className="sidenav__list-item">Item Three</li>
       <li className="sidenav__list-item">Item Four</li>
       <li className="sidenav__list-item">Item Five</li>
     </ul>
   </aside>
 
   <main className="main">
     <div className="main-header">
       <div className="main-header__heading">
       <form method="post">
  <div class="form-group">
    
    <input type="text" class="form-control" value={AddSkill} onChange={(e) => setAddSkill(e.target.value)} placeholder="Entrez une compétance"/>
  </div>
  
  
  <button type="submit" class="btn btn-primary">Publier</button>
</form>
       </div>
       <div className="main-header__updates">Add Skills</div>
     </div>
 
     <div className="main-overview">
       <div className="overviewcard">
         <div className="overviewcard__icon">Overview</div>
         <div className="overviewcard__info">Card</div>
       </div>
       <div className="overviewcard">
         <div className="overviewcard__icon">Overview</div>
         <div className="overviewcard__info">Card</div>
       </div>
       <div className="overviewcard">
         <div className="overviewcard__icon">Overview</div>
         <div className="overviewcard__info">Card</div>
       </div>
       <div className="overviewcard">
         <div className="overviewcard__icon">Overview</div>
         <div className="overviewcard__info">Card</div>
       </div>
     </div>
 
     <div className="main-cards">
       <div className="card">Card</div>
       <div className="card">Card</div>
       <div className="card">Card</div>
     </div>
   </main>
 
   <footer className="footer">
     <div className="footer__copyright">&copy; 2022 </div>
   </footer>
 </div>
  ) 
}
