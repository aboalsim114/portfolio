import React,{useState,useEffect} from 'react'
import Nav from "./Nav"
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

export default function AddArticle() {

    const [titre,setTitre] = useState("")
    const [content,setContent] = useState("")
    const [errorMsg,setErrorMsg] = useState("")
    const [successMsg,setSuccessMsg] = useState("")
    const [image, setImage] = useState(null);
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', titre);
        formData.append('content', content);
        formData.append('image', image);

        let url = 'http://localhost:8000/api/articles/';

        axios
            .post(url, formData)
            .then((res) => {
                if (res.data) {
                    setSuccessMsg('Votre article a été publié');
                }
            })
            .catch((err) => {
                setErrorMsg(err.response.data.message);
            });
    };

    return (
        <>
          
            <div className="container AddArticle">
                <div className="row">

                    <div className="col-md-8 col-md-offset-2">


                        <h1>Créer un article</h1>

                        <form onSubmit={handleSubmit} >



                            <div className="form-group">
                                <label htmlFor="title">Titre <span className="require"></span></label>
                                <input type="text" className="form-control" value={titre} onChange={(e) => setTitre(e.target.value)}  required />
                            </div>

                            <div className="form-group">
                                <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <MdEditor
                                    value={content}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={({text}) => setContent(text)}
                                    style={{height: '400px', width : "800px"}}
                                />
                            </div>

                            

                            <div className="form-group">
                                <p style={{color: errorMsg ? "red" : "green"}}>{errorMsg ? errorMsg : null}</p>
                            </div>
                            <div className="form-group">
                                <p style={{color:  "green"}}>{successMsg ? successMsg : null}</p>
                            </div>

                            <button className='btn-Publier' type="submit">
                            <span>
                            Créer un article
                            </span>
                        </button>

{/*                             <input type="submit" className='btn-Publier'  value="publier" />
 */}


                        </form>
                    </div>

                </div>
            </div>

        </>
    )
}
