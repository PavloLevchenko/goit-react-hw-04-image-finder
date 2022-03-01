import './App.css';
import React, { useState, useEffect } from 'react';
import getImages from 'Api/getImages';
import Searchbar from 'Components/Searchbar';
import ImageGallery from 'Components/ImageGallery';
import Modal from 'Components/Modal';
import Loader from 'Components/Loader';
import Button from 'Components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from 'Components/ImageGalleryItem/ImageGalleryItem.module.css';

const status = {
  idle: 'idle',
  pending: 'pending',
  loaded: 'loaded',
};

const itemOnPage = 12;
const maximumHits = 500;

function useApi(text, page) {
  const [images, setImages] = useState([]);
  const [pages, setPages] = useState(0);
  const [view, setView] = useState(status.idle);

  useEffect(() => {
    const onResponse = (data, totalHits, totalPages) => {
      if (page === 1 && totalHits) {
        if (totalHits >= maximumHits) {
          toast(`Found more than ${totalHits} images`);
        } else {
          toast(`Found ${totalHits} images`);
        }
      }
      const loaded = data.map(({ id, largeImageURL, previewURL, tags }) => {
        return { id, largeImageURL, previewURL, tags };
      });
      setPages(totalPages);
      setView(status.loaded);
      page === 1 ? setImages(loaded) : setImages(prevImages => [...prevImages, ...loaded]);
    };
    const onError = msg => {
      toast(`${text} not found`);
      setPages(0);
      setImages([]);
      setView(status.idle);
    };
    if (text) {
      setView(status.pending);
      getImages(text, page, itemOnPage, onResponse, onError);
    }
  }, [text, page]);
  return { images, pages, view };
}

const App = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [modal, setModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const data = useApi(text, page);

  const searchImages = query => {
    if (text !== query) {
      loadMore(query.toLowerCase(), 0);
    }
  };

  const loadMore = (text, page) => {
    const nextPage = page + 1;
    setPage(nextPage);
    setText(text);
    nextPage === 1 ? setOffset(0) : setOffset(window.scrollY);
  };

  useEffect(() => {
    if (data.view === status.loaded) {
      window.scrollTo({
        top: offset,
      });
    }
  }, [offset, data.view]);

  const openModal = id => {
    const image = data.images.filter(image => {
      return image.id === id;
    })[0];
    setImage(image);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={searchImages} />
      {data.view === status.loaded && <ImageGallery images={data.images} openModal={openModal} />}
      {data.pages > 1 && page < data.pages && (
        <Button onClick={() => loadMore(text, page)}>Load more</Button>
      )}
      {data.view === status.pending && (
        <Modal>
          <Loader />
        </Modal>
      )}
      {modal && (
        <Modal toggleModal={closeModal} showCloseBtn={true}>
          <img className={s.ImageGalleryFullItemImage} src={image.largeImageURL} alt={image.tags} />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
