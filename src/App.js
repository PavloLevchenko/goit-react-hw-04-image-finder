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
  modal: 'modal',
};

const itemOnPage = 12;
const maximumHits = 500;

const App = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [offset, setOffset] = useState(0);
  const [view, setView] = useState(status.idle);

  const searchImages = query => {
    if (text !== query) {
      setImages([]);
      setText(query.toLowerCase());
      loadMore(query.toLowerCase());
    }
  };

  const loadMore = query => {
    const nextPage = pages > page ? page + 1 : 1;
    setPage(nextPage);
    setView(status.pending);
    getImages(query, nextPage, itemOnPage, onResponse, onError);
    setOffset(window.scrollY);
  };

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

    setImages([...images, ...loaded]);
    setView(status.loaded);
    setPages(totalPages);
  };

  useEffect(() => {
    if (view === status.loaded) {
      console.log(offset);
      window.scrollTo({
        top: offset,
      });
    }
  }, [offset, view]);

  const onError = msg => {
    toast(`${text} not found`);
    setText('');
    setView(status.idle);
    setPage(1);
    setPages(1);
  };

  const openModal = id => {
    const image = images.filter(image => {
      return image.id === id;
    })[0];
    setImage(image);
    setView(status.modal);
    setOffset(window.scrollY);
  };

  const closeModal = () => {
    setView(status.loaded);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={searchImages} />
      {view === status.loaded && <ImageGallery images={images} openModal={openModal} />}
      {pages > 1 && page < pages && <Button onClick={() => loadMore(text)}>Load more</Button>}
      {view === status.pending && (
        <Modal>
          <Loader />
        </Modal>
      )}
      {view === status.modal && (
        <Modal toggleModal={closeModal} showCloseBtn={true}>
          <img className={s.ImageGalleryFullItemImage} src={image.largeImageURL} alt={image.tags} />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
