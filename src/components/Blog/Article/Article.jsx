import React,{useState,useEffect} from 'react'
import "../Blog.css"
import { Link,useParams } from 'react-router-dom'
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Article() {

    const [data,setData] = useState([])
    const {article_id} = useParams();
    const admin = localStorage.getItem("authToken");

    useEffect(() => {
        let url = `http://localhost:8000/api/articles/${article_id}/`;
        axios.get(url)
          .then((res) => {
            if (res.data) {
              setData(res.data);
              console.log(res);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, [article_id]);
      
      const formattedDate = data.created_at ? new Date(data.created_at).toLocaleDateString("fr-FR") : '';

    return (
        <>
    <div className="retour">
    <Link  className='btnBack' to="/blog"><i class="fa-regular fa-circle-left fa-2xl"></i></Link>
    </div>
            <div className="container pb50">
                <div className="row">
                    <div className="col-md-9 mb40">
                        <article>
                            <div className="post-content">
                                <h3> {data.title}</h3>
                                <img src={data.image} alt="Description de l'image" />
                                <ul className="post-meta list-inline">
                                    <li className="list-inline-item">
                                        <i className="fa fa-user-circle-o"></i> <a href="">Abdulhalim sami</a>
                                    </li>
                                    
                                    <li className="list-inline-item">
                                        <i className="fa fa-clock"></i> <a href=""> {formattedDate} </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <i className="fa fa-code"></i> <a href="">Developpeur full stack</a>
                                    </li>
                                    <li className="list-inline-item">
                                    {admin && <span> <Link to={`/editArticle/${article_id}`}>Modifier l'article</Link></span>}
                                    </li>
                                </ul>
                                { data.content && <ReactMarkdown children={data.content} />  }
                                <hr className="mb40" />
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
