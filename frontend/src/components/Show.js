import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useParams, Link } from 'react-router-dom';
import Votes from './Votes';
import PhotoBig from './PhotoBig';


function Show() {
    const {id} = useParams();
    const [photo, setPhoto] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    useEffect(function () {
        const getPhoto = async function () {
            const res = await fetch("http://localhost:3001/posts/"+ id);
            const data = await res.json();
            setPhoto(data);
            
            const resC = await fetch("http://localhost:3001/comments/byPost/"+ id);
            const dataC = await resC.json()
            setComments(dataC);
            setLoading(false);
        }
        getPhoto();
    }, []);

    if (isLoading) {
        return <div className="App">Loading...</div>;
      }
      return (
        <>
          <PhotoBig photo={photo} />
          
        </>
    
      );
}

export default Show;