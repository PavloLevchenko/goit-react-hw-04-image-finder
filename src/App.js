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

class App extends Component {
  state = {
    text: '',
    images: [],
    page: 1,
    pages: 0,
    work: App.status.idle,
    error: '',
  };
  static itemOnPage = 12;
  static status = {
    idle: 'idle',
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected',
  };
  changeSearchText = text => {
    this.setState({
      text: text.toLowerCase(),
      work: App.status.pending,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    const { work, text, page } = this.state;
    if (work === App.status.pending) {
      getImages(text, page, App.itemOnPage, this.onResponse, this.onError);
    }
    if (work === App.status.resolved) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
  onResponse = (images, totalPages) => {
    const loaded = images.map(image => {
      const { id, largeImageURL, previewURL, tags } = image;
      return { id, largeImageURL, previewURL, tags };
    });
    this.setState({ images: loaded, pages: totalPages, work: App.status.resolved });
  };
  onError = msg => {
    this.setState({ error: msg, work: App.status.rejected });
  };
  loadMore = () => {
    const { page, pages } = this.state;
    const nextPage = pages > page ? page + 1 : 1;
    this.setState({
      page: nextPage,
      work: App.status.pending,
    });
  };
  render() {
    const { work, text, images, pages } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.changeSearchText} />
        {work === App.status.resolved && <ImageGallery images={images} />}
        {pages > 1 && <Button onClick={this.loadMore}>Load more</Button>}
        {work === App.status.rejected && toast(`${text} not found`)}
        {work === App.status.pending && (
          <Modal>
            <Loader />
          </Modal>
        )}
        <ToastContainer />
      </div>
    );
  }
}

export default App;
