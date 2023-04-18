import React,{useState,useEffect} from 'react'
import "./Blog.css"
import { Link } from 'react-router-dom'
import axios from 'axios';

export default function Blog() {

    const [data,setData] = useState([])



    useEffect(() => {
        let url = "http://localhost:3001/api/Dashboard";
        axios.get(url)
          .then((res) => {
            if (res.data.articles) {
              setData(res.data.articles);
            }
          })
          .catch((err) => {
         console.log(err);
          });
      }, []);

      const formattedDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString("fr-FR") : '';


  return (
      <>
    <div className="retour">
    <Link  className='btnBack' to="/"><i class="fa-regular fa-circle-left fa-2xl"></i></Link>
    </div>
    <div id="main-content " class="blog-page">
    <div class="container mt-4">
        <div class="row clearfix">
            <div class="col-lg-8 col-md-12 left-box">



                
    {data.map((article) => (
      <div class="card" key={article._id}>
  <div class="date-time-container">
    <time class="date-time" datetime={formattedDate}>
      <span>{data.createdAt ? new Date(data.createdAt).toLocaleDateString("fr-FR") : ''} </span>
      <span class="separator"></span>
    </time>
  </div>
  <div class="content">
  
    <div class="infos">
      <a href={`article/${article._id}`}>
        <span class="title">
         {article.titre}
        </span>
      </a>

      <p class="description">
      {article.content.length <= 200 ? article.content : article.content.slice(0, 400) + '  ....'}
      </p>
    </div>

    <a href={`article/${article._id}`} className="action">voir plus</a>

  </div>
</div>
))}


              


          
                                        
                           
            </div>
         
        </div>

    </div>
</div>
    </>
  )
}
