import React, { useState, useEffect } from 'react';
import "./Blog.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function Blog() {
    const [Data, setData] = useState([]);
    const admin = localStorage.getItem("admin");

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
    }, []);
      
    
    return (
        
        <>
        
            <div className="retour">
                <Link className='btnBack' to="/"><i className="fa-regular fa-circle-left fa-2xl"></i></Link>
            </div>
            <div id="main-content" className="blog-page">
                <div className="container mt-4">
                    <div className="row clearfix">
                        <div className="col-lg-8 col-md-12 left-box">
                            {Data.map((article) => {
                                const formattedDate = article.created_at && new Date(article.created_at).toLocaleDateString("fr-FR");
                                return (
                                    <div className="card" key={article.id}>
                                        <div className="date-time-container">
                                            <time className="date-time" dateTime={formattedDate}>
                                                <span>{formattedDate} </span>
                                                <span className="separator"> </span>
                                            </time>
                                        </div>
                                        <div className="content">
                                            <div className="infos">
                                                <a href={`article/${article.id}`}>
                                                    <span className="title">
                                                        {article.title}
                                                    </span>
                                                </a>
                                                <p className="description">
                                                    {article.content.length <= 200 ? article.content : article.content.slice(0, 400) + '  ....'}
                                                </p>
                                            </div>
                                            <span><Link className="action" to={`/article/${article.id}`}>voir plus</Link></span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
           

        </>
    )
}
