import React, { useState,useEffect } from 'react';
import "./Commentaire.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from "../images/avatar.png"
export default function Commentaire(props) {
    const admin = localStorage.getItem("token");
    const [comment, setComment] = useState("");
    const [mergedComments, setMergedComments] = useState([]);



    useEffect(() => {
        async function fetchData() {
            // Fetch comments
            const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/commentaires/comments_by_article?article_id=${props.article_id}`);
            const comments = commentsResponse.data;

            // Get unique user IDs from comments
            const userIds = [...new Set(comments.map(comment => comment.user))];

            // Fetch user details for each user ID
            const usersPromises = userIds.map(id => axios.get(`http://127.0.0.1:8000/api/users/${id}/`));
            const usersResponses = await Promise.all(usersPromises);
            
            // Create a map of userID -> user object for easier access
            const usersMap = {};
            usersResponses.forEach((response, index) => {
                usersMap[userIds[index]] = response.data;
            });

            // Merge user details with comments
            const merged = comments.map(comment => ({
                ...comment,
                user: usersMap[comment.user]
            }));

            // Update state with merged data
            setMergedComments(merged);
        }

        fetchData();
    }, []);


    const addComment = async  (e) => {
        e.preventDefault();
        let url = "http://127.0.0.1:8000/api/commentaires/"

        const data = {
            comment : comment,
            article : props.article_id,
            user : localStorage.getItem("userid")
        }

        try
        {
            const response = await axios.post(url,data);
            if(response.status < 300)
            {
                setComment("");
       
            }
        }
        catch(err)
        {
            console.log(err);
        }


    }

    return (
        <div className="Commentaire">
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-5 col-md-6 col-12 pb-4">
                            <h1>commentaires</h1>

                    
                            <div className="comment mt-4 text-justify float-left" >
                            {mergedComments.map((item) => {
                            return (
                               <div  key={item.id}>
                              <img src={item.user.user_image ? item.user.user_image : Avatar} alt={item.user.user_image} className="rounded-circle" width="40" height="40" /> 
                             <h4>{item.user.username}</h4>
                               
                                
                                   
                                <span>{new Date(item.created_at).toLocaleDateString("fr-FR")}</span>
                                 
                                
                                <p>{item.comment}</p>
                               </div>
                                );
                            })}
                            </div>
                      

                             
                         

                        </div>
                        <div className="col-lg-4 col-md-5 col-sm-4 offset-md-1 offset-sm-1 col-12 mt-4">
                            <form id="algin-form">
                                <div className="form-group">
                                    <h4>laissez un commentaire</h4>
                                    <label htmlFor="message">Message</label>
                                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} name="msg" id="msg" cols="30" rows="5" className="form-control" style={{ backgroundColor: 'black' }}></textarea>
                                </div>

                                <div className="form-group">
                                    {admin ?
                                        <button  type="button" onClick={addComment} id="post" className="btn ">Poster un commentaire</button>
                                        : <p style={{ textAlign: "center", fontFamily: "cursive" }}>Connectez vous <Link style={{ color: "green" }} to={"/connexion"} >ici</Link> pour pouvoir ajouter un commentaire</p>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
