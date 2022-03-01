import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
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
  resolved: 'resolved',
  rejected: 'rejected',
  modal: 'modal',
};

const itemOnPage = 12;
const maximumHits = 500;

const App = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [offset, setOffset] = useState(0);
  const [work, setWork] = useState('');

  const changeSearchText = query => {
    if (text !== query) {
      setImages([]);
      setText(query.toLowerCase());
      setWork(status.pending);
      setPage(1);
    }
  };

  const onResponse = useCallback(
    (data, totalHits, totalPages) => {
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
      setWork(status.resolved);
      setPages(totalPages);
    },
    [images, page],
  );

  useEffect(() => {
    if (work === status.pending) {
      getImages(text, page, itemOnPage, onResponse, onError);
    }
    if (work === status.resolved) {
      window.scrollTo({
        top: offset,
      });
    }
  }, [offset, onResponse, page, text, work]);

  const onError = msg => {
    setWork(status.rejected);
    setPage(1);
    setPages(1);
  };

  const loadMore = () => {
    const nextPage = pages > page ? page + 1 : 1;
    setPage(nextPage);
    setWork(status.pending);
    setOffset(window.scrollY);
  };

  const openModal = event => {
    const id = Number(event.target.dataset.id);
    if (id) {
      const image = images.filter(image => {
        return image.id === id;
      })[0];
      setImage(image);
      setWork(status.modal);
      setOffset(window.scrollY);
    }
  };

  const closeModal = () => {
    setWork(status.resolved);
  };

  if (work === status.rejected) {
    toast(`${text} not found`);
    setText('');
    setWork(status.idle);
  }

  return (
    <div className="App" onClick={openModal}>
      <Searchbar onSubmit={changeSearchText} />
      {work === status.resolved && <ImageGallery images={images} />}
      {pages > 1 && page < pages && <Button onClick={loadMore}>Load more</Button>}
      {work === status.pending && (
        <Modal>
          <Loader />
        </Modal>
      )}
      {work === status.modal && (
        <Modal toggleModal={closeModal} showCloseBtn={true}>
          <img className={s.ImageGalleryFullItemImage} src={image.largeImageURL} alt={image.tags} />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
