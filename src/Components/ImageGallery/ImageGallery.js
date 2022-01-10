import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';
import ImageGalleryItem from 'Components/ImageGalleryItem';

class ImageGallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
  };
  render() {
    const { images } = this.props;
    return (
      <ul className={s.ImageGallery}>
        {images.map(image => {
          const { id, largeImageURL, previewURL, tags } = image;
          return (
            <ImageGalleryItem
              key={id}
              largeImageURL={largeImageURL}
              previewURL={previewURL}
              tags={tags}
            />
          );
        })}
      </ul>
    );
  }
}
export default ImageGallery;
