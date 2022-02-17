import './App.css';
import React, { Component } from 'react';
import getImages from 'Api/getImages';
import Searchbar from 'Components/Searchbar';
import ImageGallery from 'Components/ImageGallery';
import Modal from 'Components/Modal';
import Loader from 'Components/Loader';
import Button from 'Components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from 'Components/ImageGalleryItem/ImageGalleryItem.module.css';

class App extends Component {
  state = {
    currentImage: null,
    text: '',
    images: [],
    page: 1,
    pages: 0,
    offset: 0,
    work: App.status.idle,
    error: '',
  };
  static itemOnPage = 12;
  static maximumHits = 500;
  static status = {
    idle: 'idle',
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected',
    modal: 'modal',
  };
  changeSearchText = text => {
    if (this.state.text !== text) {
      this.setState({
        images: [],
        text: text.toLowerCase(),
        work: App.status.pending,
      });
    }
  };
  componentDidUpdate(prevProps, prevState) {
    const { work, text, page } = this.state;

    if (work === App.status.pending) {
      getImages(text, page, App.itemOnPage, this.onResponse, this.onError);
    }
    if (work === App.status.resolved) {
      window.scrollTo({
        top: this.state.offset,
      });
    }
  }
  onResponse = (images, totalHits, totalPages) => {
    if (this.state.page === 1 && totalHits) {
      if (totalHits >= App.maximumHits) {
        toast(`Found more than ${totalHits} images`);
      } else {
        toast(`Found ${totalHits} images`);
      }
    }
    const loaded = images.map(({ id, largeImageURL, previewURL, tags }) => {
      return { id, largeImageURL, previewURL, tags };
    });

    this.setState(state => {
      return {
        images: [...state.images, ...loaded],
        pages: totalPages,
        work: App.status.resolved,
      };
    });
  };
  onError = msg => {
    this.setState({ page: 1, pages: 1, error: msg, work: App.status.rejected });
  };
  loadMore = () => {
    const { page, pages } = this.state;
    const nextPage = pages > page ? page + 1 : 1;
    this.setState({
      page: nextPage,
      work: App.status.pending,
      offset: window.scrollY,
    });
  };
  openModal = event => {
    const id = Number(event.target.dataset.id);
    const images = this.state.images;
    if (id) {
      this.setState({
        currentImage: images.filter(image => {
          return image.id === id;
        })[0],
        work: App.status.modal,
        offset: window.scrollY,
      });
    }
  };
  closeModal = () => {
    this.setState({
      work: App.status.resolved,
    });
  };
  render() {
    const { work, text, images, page, pages, currentImage } = this.state;

    if (work === App.status.rejected) {
      toast(`${text} not found`);
    }
    return (
      <div className="App" onClick={this.openModal}>
        <Searchbar onSubmit={this.changeSearchText} />
        {work === App.status.resolved && <ImageGallery images={images} />}
        {pages > 1 && page < pages && <Button onClick={this.loadMore}>Load more</Button>}
        {work === App.status.pending && (
          <Modal>
            <Loader />
          </Modal>
        )}
        {work === App.status.modal && (
          <Modal toggleModal={this.closeModal} showCloseBtn={true}>
            <img
              className={s.ImageGalleryFullItemImage}
              src={currentImage.largeImageURL}
              alt={currentImage.tags}
            />
          </Modal>
        )}
        <ToastContainer />
      </div>
    );
  }
}

export default App;
