import React,{useState,useEffect} from 'react'
import "../Blog.css"
import { Link,useParams,useNavigate } from 'react-router-dom'
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Commentaire from '../../Commentaires/Commentaire';
export default function Article() {
    const Navigate = useNavigate();
    const [data,setData] = useState([])
    const [newComment,setNewComment] = useState([])
    const {article_id} = useParams();
    const admin = localStorage.getItem("token");


    
    useEffect(() => {
        const fetchCommentaires = async () => {
            let url = `http://127.0.0.1:8000/api/commentaires/comments_by_article/?article_id=${article_id}`
            try {
                const response = await axios.get(url);
                if (response.status < 300) {
                    setNewComment(response.data);
                }   
            }
            catch (error) {
                console.error(error);
            }

        }
        fetchCommentaires()
    }, [article_id]);


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

    

      const handleDeleteArticle = async () => {
        let ask = window.confirm("Voulez-vous vraiment supprimer cet article?");
        if (ask) {
            let url = `http://localhost:8000/api/articles/${article_id}`;
            try {
                const response = await axios.delete(url);
                if (response.status < 300) {
                    alert("Article supprimé avec succès");
                    Navigate("/blog");
                } else {
                    alert("Une erreur s'est produite lors de la suppression de l'article.");
                }
            } catch (error) {
                console.error("Error deleting the article:", error);
                alert("Une erreur s'est produite lors de la suppression de l'article.");
            }
        }
    }





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
                                    {admin && <span  className='btn btn-info' > <Link style={{color : "#fff", cursor : "pointer" , padding : 0}} to={`/editArticle/${article_id}`}>Modifier l'article</Link></span>}
                                    </li>
                                    <li className="list-inline-item">
                                    {admin &&  <button onClick={handleDeleteArticle} style={{color : "#fff", fontSize : "12px",padding: "10px"}} className='btn btn-danger'>Supprimer l'article</button> }
                                    </li>
                                </ul>
                                { data.content && <ReactMarkdown children={data.content} />  }
                                <hr className="mb40" />
                            </div>
                        </article>
                    </div>
                    
                </div>
                
            </div>
          
            <Commentaire
                comment={newComment}
                article_id={article_id}
            />
      

   
        </>
    );
}
