import React,{useState,useEffect} from 'react'
import { useParams,Link } from 'react-router-dom'
import "./Dashboard.css"
import Nav from "./Nav"
import { BiTrash } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { GrArticle } from "react-icons/gr";
import { BiWorld } from "react-icons/bi";
import { RiAddFill } from "react-icons/ri";
import axios from 'axios';

export default function Dashboard() {
    const {userid} = useParams();
    const [data,setData] = useState([])
    const [article_id,setArticle_id] = useState("")
    useEffect(() => {
      let url = "http://localhost:8000/api/articles/";
      axios.get(url)
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }
        })
        .catch((err) => {
       console.log(err);
        });
    }, [userid]);


    



    return (
      <>
       
        <div className="Dashboard">
          <div class="page-content page-container" id="page-content">
            <div class="padding">
              <div class="row container d-flex justify-content-center">
                <div class="col-lg-8 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <p class="card-description">
                        blog cards 
                      </p>
                      <span ><Link style={{cursor: "pointer",fontSize : "20px"}} to={`/addArticle/`} className="badge badge-info"><RiAddFill/> </Link></span>
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th>id</th>
                              <th>Tittre</th>
                              <th>Actions</th>
                              <th>Date</th>
                              <th>voir l'article</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((article) => {
                                  const formattedDate = article.created_at && new Date(article.created_at).toLocaleDateString("fr-FR");
                              return (
                                <tr key={article.id}>
                                <td>{article.id}</td>
                                <td>{article.title}</td>
                                <td>
                                  <button  className="badge badge-danger" style={{marginRight : "10px"}} ><BiTrash/></button>
                                  <Link to={`/editArticle/${article.id}`} className="badge badge-success"><BiEdit/></Link>
                                </td>
                                <td>{formattedDate}</td>
                                <td>
                                <Link to={`/article/${article.id}`} className="badge badge-primary"><BiWorld/></Link>

                                </td>
                              </tr>
                              )
                            }
                              
                           
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
