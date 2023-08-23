import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import './Dashboard.css';
import Nav from './Nav';
export default function EditArticle() {
  const { article_id } = useParams();

  const [title, settitle] = useState('');
  const [content, setContent] = useState('');
  const [successMsg,setSuccessMsg] = useState("")
  const [errorMsg,setErrormsg] = useState("")
  const [data,setData] = useState([])
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  const handletitleChange = (event) => {
    settitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };



  useEffect(() => {
    const fetData = async () => {
      let url = `http://localhost:8000/api/${article_id}/`;
      const res = await axios.get(url);
      const result = res.data;
      setData(result)
      settitle(result.title);
  setContent(result.content);

    }
    fetData();
  }, [article_id]);


  const handleSubmit = (e) => {
    e.preventDefault()

    let url = `http://localhost:8000/api/${article_id}/`;

    const data = {
        title : title,
        content : content
    }
    

    axios.patch(url,data)
    .then(res => {
        if(res.data)
        {
            setSuccessMsg("l'article est mise a jour");
        }


    })

    .catch((err) => {
        setErrormsg(err.response.data.message)
    })




  }












  return (
    <>

    <div className='container mt-4'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label  htmlFor='title'>title:</label>
          <input
            type='text'
            id='title'
            className='form-control'
            value={title}
            onChange={handletitleChange}
            />
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
        
        <input type="submit" value="mise a jour" />
        </div>

    <div className="form-group">
    <p style={{color: errorMsg ? "red" : "green"}}>{errorMsg ? errorMsg : null}</p>
        <p style={{color:  "green"}}>{successMsg ? successMsg : null}</p>
    </div>

      </form>
    </div>
     </>
  );
}
