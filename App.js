import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import axios  from 'axios';
import { Button, Form } from 'react-bootstrap';
const API_URL = 'https://api.unsplash.com/search/photos';
function App() {
  const API_KEY = process.env.REACT_APP_UNSPLASH_API_KEY
  console.log('api key', API_KEY);
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [total_pages, set_total_pages] = useState(0);
  const [page, set_page] = useState(1);
  const [error_msg, set_error_msg] = useState("");
 
  const getImg = useCallback(async () => {
    try {
      if(searchInput.current.value){
        set_error_msg('');
        const {data} = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=18&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`);
        console.log('result', data); 
        if(data.total_pages){
          set_error_msg('');
          setImages(data.results);
          set_total_pages(data.total_pages);
        } 
        else {
          set_error_msg('No Images Found, Try Another Keyword.')
        }
      }
    } catch (error) {
      set_error_msg("Try Again Later!")
      console.log(error);
    }
  }, [page])
  useEffect(()=>{
    getImg();
  },[getImg]);
  const resetSearch = () => {
    set_page(1);
    getImg();
   
  }
 
  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };
 
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };
  return (
    <div className="container">
      <h1 className='title'>Gallery</h1>
      {error_msg && <p className='error-msg'>{error_msg}</p>}
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control 
          type="search" 
          placeholder="Type something to search..." 
          className='search-input'
          ref={searchInput}
          />
        </Form>
      </div>
      <div className='filters'>
          <div onClick={()=>handleSelection('Mountains')}>Mountains</div>
          <div onClick={()=>handleSelection('Forests')}>Forests</div>
          <div onClick={()=>handleSelection('Beaches')}>Beaches</div>
          <div onClick={()=>handleSelection('River')}>River</div>
          <div onClick={()=>handleSelection('Hills')}>Hills</div>
      </div>
      <div className='images'>
        {
          images.map(image => {
            return(
              <img key={image.id} 
              src = {image.urls.thumb} 
              alt={image.alt_description}
              className='image'/>
            )
          })
        }
      </div>  
      <div className='buttons'>
        {
          page > 1 && <Button onClick={() => set_page(page-1)}>Previous</Button>
        }
        {
          page < total_pages && <Button onClick={() => set_page(page+1)}>Next</Button>
        }
      </div> 
    </div>
  );
}

export default App;
