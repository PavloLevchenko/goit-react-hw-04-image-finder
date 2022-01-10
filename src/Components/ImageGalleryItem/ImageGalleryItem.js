import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';
import Modal from 'Components/Modal';

class ImageGalleryItem extends Component {
  static propTypes = {
    largeImageURL: PropTypes.string.isRequired,
    previewURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  };
  state = {
    showModal: false,
  };
  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };
  render() {
    const { largeImageURL, previewURL, tags } = this.props;
    const { showModal } = this.state;
    return (
      <li className={s.ImageGalleryItem}>
        <img
          src={previewURL}
          alt={tags}
          className={s.ImageGalleryItemImage}
          onClick={this.toggleModal}
        />
        {showModal && (
          <Modal toggleModal={this.toggleModal} showCloseBtn={true}>
            <img className={s.ImageGalleryFullItemImage} src={largeImageURL} alt={tags} />
          </Modal>
        )}
      </li>
    );
  }
}
export default ImageGalleryItem;
